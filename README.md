# CSS via Components

A single React component to inject CSS with ease.<br>
It works with SSR (even using React 16's [renderToNodeStream](https://reactjs.org/docs/react-dom-server.html#rendertonodestream)) and client-side rendering out-of-the-box.

<img alt="TravisCI" src="https://travis-ci.org/rofrischmann/react-css-component.svg?branch=master"> <a href="https://codeclimate.com/github/rofrischmann/react-css-component/coverage"><img alt="Test Coverage" src="https://codeclimate.com/github/rofrischmann/react-css-component/badges/coverage.svg"></a> <img alt="npm version" src="https://badge.fury.io/js/react-css-component.svg"> <img alt="npm downloads" src="https://img.shields.io/npm/dm/react-css-component.svg"> <img alt="dependencies" src="https://david-dm.org/rofrischmann/react-css-component.svg">

## Support Me
If you're using [Robin Frischmann](https://rofrischmann.de)'s packages, please consider supporting his [Open Source Work](https://github.com/rofrischmann) on [**Patreon**](https://www.patreon.com/rofrischmann).

## Installation
```sh
# yarn
yarn add react-css-component

# npm
npm i --save react-css-component
```
> **Caution**: It requires `react` and `prop-types` to be present.

## Why?
This package was created as a possible solution to a [question](https://twitter.com/kentcdodds/status/972268883339108352) by [Kent C. Dodds](https://twitter.com/kentcdodds).<br>
Creating resuable React components in general is pretty easy, but adding styling is not. The simplest way is to just use [inline style](https://reactjs.org/docs/dom-elements.html#style), which works pretty well for many basic components. Yet, it is very limited. Neither do we have have pseudo classes nor do we have media queries.<br>
So, at some point, we need actual CSS. We could include a CSS file, but that would require an additional build step e.g. using [Webpack](https://webpack.js.org) in combination with its [css-loader](https://github.com/webpack-contrib/css-loader). While this would work, it's not very compelling to enforce a certain build tool, just to use a single component.<br>
Alright, how about [CSS in JS](http://michelebertoli.github.io/css-in-js/)? Using plain JavaScript to style the component sounds great, as the component is written in JavaScript anyways. But, [most CSS in JS solutions are way to big to depend on](https://github.com/hellofresh/css-in-js-perf-tests#bundle-sizes). They're built for applications, not for independent reusable components. Yet, we can still benefit from writing our CSS in JavaScript. This package is the attempt to provide the smallest universal solution for inlining CSS in JavaScript possible.

## How?
Depending on whether [universal rendering](#universalrendering) (server-side rendering with client-side rehydration) or [client-side only rendering](#clientrendering) is used, the implementation uses a different logic.

### Universal Rendering
**Server Rendering**: The [UniversalStyle](#style) component renders a primitive *style* DOM element that uses `dangerouslySetInnerHTML` to inject a CSS string.<br>
**Client Rehydration**: At first, the [UniversalStyle](#style) component just gets rehydrated to match the server-side markup. But, as soon as it is about to unmount, the *style* element is copied to the `document.head` **once**. This will ensure it's existence just in case any other component using it's CSS is still visible.

#### Caveat
During server-side rendering, the [UniversalStyle](#style) component is not able to track it's own occurence, which may result in duplicate *style* elements. **This won't break anything, but also is not optimal**. To ensure that each [UniversalStyle](#style) instance is only rendered once, we need an unique cache on every render. This is achieved by passing a simple cache via React's context feature. Check the [StyleCacheProvider](#stylecacheprovider) component for more information.



### Client-Only Rendering
If we only render on the client-side anyways, we can skip that complex flow and just use the [ClientStyle](#style).<br>
It simply injects a *style* element into the `document.head` on instantiation and tracks its occurence using a global cache.

> **Note**: The [ClientStyle](#style) component won't throw with server-side rendering, but it simply doesn't render styles.

## Style
Both `UniversalStyle` and `ClientStyle` share the exact same component API.<br>
This component is the core component and is used to inject the CSS.

### Props

| Parameter | Type | Description |
| --- | --- | --- |
| css | (*string*) | A CSS string that is rendered |

### Import
```javascript
// universal rendering
import { UniversalStyle as Style } from 'react-css-component'

// client-only rendering
import { ClientStyle as Style } from 'react-css-component'
```

### Example
```javascript
const css = `
  .button {
    background-color: darkblue;
    padding: 20px 10px;
    font-size: 16px;
    color: white
  }

  .button:hover {
    background-color: blue
  }
`

// return an array to colocate style and the button
const Button = () => [
  <Style css={css} />
  <button className="button">Click Me!</button>
]
```

## StyleCacheProvider
The StyleCacheProvider is used to prevent duplication. It is not required, but recommended.<br>
It should wrap your whole application and is only required once, no matter how many components use the [Style](#style) component.<br>
It does not alter the resulting DOM structure as it simply renders its children.<br>
It passes an empty cache object via React's context feature.

> **Tip**: If you're using the [UniversalStyle](#style) component for a reusable shared component, make sure to inform your users about the caveat of not using this component.

### Example
```javascript
import { StyleCacheProvider } from 'react-css-component'

const App = () => (
  <StyleCacheProvider>
    <Button />
  </StyleCacheProvider>
)
```

## License
react-css-component is licensed under the [MIT License](http://opensource.org/licenses/MIT).<br>
Documentation is licensed under [Creative Common License](http://creativecommons.org/licenses/by/4.0/).<br>
Created with ♥ by [@rofrischmann](http://rofrischmann.de).
