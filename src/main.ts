import getSeparatedContent from './getSeparatedContent';
import { StrongMap } from './map';

enum Selector {
  ID,
  CLASS,
  TAG,
}

interface Css2JssWriter {
  (htmlSelector?: string): void;
}

const transformSelector = (selector: string) => {
  const [separatedSelector, match] = getSeparatedContent(selector.trim(), [
    '>',
    /\s/,
  ]);

  return {
    selector,
    priority: (match ? separatedSelector : [separatedSelector as string])
      .map((_selector) => {
        if (_selector.startsWith('#')) {
          return {
            type: Selector.ID,
            value: _selector.slice(1),
          };
        }
        if (_selector.startsWith('.')) {
          return {
            type: Selector.CLASS,
            value: _selector.slice(1),
          };
        }
        return {
          type: Selector.TAG,
          value: _selector,
        };
      })
      .reduce((prev, current) => {
        if (current.type === Selector.ID) {
          return prev + 1000;
        }
        if (current.type === Selector.CLASS) {
          return prev + 100;
        }
        return prev + 10;
      }, 0),
  };
};

const transformSelectorBody = (selectorBody: string, priority: number) => {
  return selectorBody
    .split(';')
    .filter(Boolean)
    .reduce((body, styleKV) => {
      const _styleKV = styleKV.split(':').map((v) => v.trim());
      const key = _styleKV[0];
      let value = _styleKV[1];
      let _priority = priority;
      if (value.endsWith('!important')) {
        value = value.slice(0, value.length - 10);
        _priority = Infinity;
      }

      body[key] = {
        key,
        value,
        priority: _priority,
      };

      return body;
    }, {});
};

export const css2Jss = (cssStr: string): Css2JssWriter => {
  const l = cssStr.length;

  let moveSliceStart = 0;
  const selectors = [];
  for (let i = 0; i < l; i++) {
    const c = cssStr[i];
    if (c === '{') {
      const selector = cssStr.slice(moveSliceStart, i).trim();
      moveSliceStart = i + 1;

      i = cssStr.indexOf('}', i + 1);

      const _selector = transformSelector(selector);
      selectors.push({
        selector,
        selectorBody: transformSelectorBody(
          cssStr
            .slice(moveSliceStart + 1, i)
            .trim()
            .replaceAll('\n', ' '),
          _selector.priority
        ),
      });

      moveSliceStart = i + 1;
    }
  }

  return (htmlSelector) => {
    const _html: HTMLElement = htmlSelector
      ? document.querySelector(htmlSelector)
      : document.documentElement;

    const _style = new StrongMap<HTMLElement, any>();
    selectors.forEach(({ selector, selectorBody }) => {
      const nodeList = _html.querySelectorAll(selector);

      nodeList.forEach((element) => {
        if (!_style.has(element)) {
          _style.set(element, {});
        }

        const stylesheet = _style.get(element);
        Object.keys(selectorBody).forEach((styleKey) => {
          const styleValue = selectorBody[styleKey];
          if (
            !stylesheet[styleKey] ||
            stylesheet[styleKey].priority <= styleValue.priority
          ) {
            stylesheet[styleKey] = styleValue;
          }
        });

        _style.set(element, stylesheet);
      });
    });

    _style.forEach((element, stylesheet) => {
      const style = Object.values(stylesheet)
        .map(({ key, value }) => `${key}: ${value}`)
        .join(';');

      element.setAttribute('style', style);
    });
  };
};
