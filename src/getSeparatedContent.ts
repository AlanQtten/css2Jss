type Token = string | RegExp;

/**
 * 对字符串做切分，匹配/切分成功到返回[string[], true], 没有匹配/切分返回[string, false]
 * @example
 *  // returns [['A', 'B', 'C'], true]
 *  getSeparatedContent('A\tB\rC')
 * @example
 *  // returns [['A', 'B\rC'], true]
 *  getSeparatedContent('A\tB\rC', [/\t/])
 * @example
 *  // returns ['A', false]
 *  getSeparatedContent('A')
 */
const getSeparatedContent = (
  text: string,
  tokens = [/\t/, /\r/, /\n/, ',', ';']
): [string[], true] | [string, false] => {
  if (!tokens || !tokens.length) {
    return [text, false];
  }

  let match = false;

  function separate(str: string, [token, ...restTokens]: Token[]): string[] {
    if (!token) {
      return [str.trim()];
    }

    const list = str.split(token);
    match = match || list.length > 1;

    return list
      .reduce<
        string[]
      >((prevList, unitStr) => [...prevList, ...separate(unitStr, restTokens)], [])
      .filter(Boolean);
  }

  const list = separate(text, tokens);

  if (match) {
    return [list, true];
  }
  return [text, false];
};

export default getSeparatedContent;
