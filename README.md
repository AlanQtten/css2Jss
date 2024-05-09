# css2Jss

transform stylesheet to inline style

---

## Demo

```js
import { css2Jss } from 'css2jss'

const write = css2Jss(`
  .box div {
    width: 50px;
    height: 50px;
    background-color: red!important;
  }

  .box div {
    background-color: blue;
  }
`)
write()
// or write(parentElement)
```

transform as 

```html
<div class="box">
  <div style="width: 50px; height: 50px; background-color: red;">...</div>
</div>
```

--- 

## TODO

- [ ] test
- [ ] support option `keepImportantFlag`
- [ ] support attribute selector