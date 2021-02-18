# react-list-lazy-load

Lazy Loading wrapper for [React-List](https://github.com/orgsync/react-list).

This component works for finite collections only. If you have a large list of a
known size that you do not want to load all at once, this component allows
loading pages once the user scrolls near them. It does **not** implement
infinite scrolling.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![size][size-image]][size-url]

[npm-image]: https://img.shields.io/npm/v/react-list-lazy-load.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/react-list-lazy-load
[travis-image]: https://img.shields.io/travis/u-wave/react-list-lazy-load.svg?style=flat-square
[travis-url]: https://travis-ci.org/u-wave/react-list-lazy-load
[size-image]: https://img.shields.io/bundlephobia/minzip/react-list-lazy-load.svg?style=flat-square
[size-url]: https://bundlephobia.com/result?p=react-list-lazy-load

## Installation

```bash
npm install --save react-list-lazy-load
```

## Usage

[Demo](https://u-wave.github.io/react-list-lazy-load) - [Demo source code](./example.js)

You wrap it around a `<ReactList />` element to :sparkles: magically :sparkles:
add lazy loading hooks:

```js
import ReactList from 'react-list';
import LazyLoading from 'react-list-lazy-load';

const MyList = ({ items, onRequestPage }) => (
  <LazyLoading
    length={items.length}
    items={items}
    onRequestPage={onRequestPage}
  >
    <ReactList
      itemRenderer={(idx, key) => (
        <div key={key}>{items[idx]}</div>
      )}
      type="uniform"
      length={items.length}
    />
  </LazyLoading>
);
```

## API

### `items={Array}`

An array of the items you're showing. This is used to determine when to load a
page. If the user scrolls close to a `null` item in this array, or outside of
array bounds, a new page will be loaded.

I.e., a `null` item is regarded as an unloaded item.

### `length={Number}`

The total amount of items, on all "pages". Defaults to

### `pageSize={Number}`

Amount of items on a page. This is used to determine which page to load.
Defaults to 25 (rather arbitrarily).

### `loadMargin={Number}`

When to start loading the next page. The next page will be loaded when the user
scrolls within `loadMargin` items from an unloaded item. You'll want to change
this depending on the size of your items. If your items are super small, you
should pick a larger `loadMargin`, but if they are rather large, you might be
good with a margin of like 1 or 2 items.

Defaults to 5.

### `onRequestPage={function(page, cb)}`

Callback to load a page. This only tells you to load a new page--you should
merge it into the `items` prop yourself.

## Licence

[MIT](./LICENSE)
