# SVG Sprite Webpack Plugin

[![NPM Version][npm-image]][npm-url]
[![Build Status][circle-image]][circle-url]
[![Downloads Stats][npm-downloads]][npm-url]

## Description

A webpack plugin/loader to make SVG `<use>`-based icon systems easy in Webpack.
Creates an SVG sprite with `<symbol>` tags from imported SVG files, and returns
a URL to be passed to an SVG `<use>` tag. Uses kisenka's
[svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader) for internal
transformations (from standalone SVG file to `<symbol>` tag).

## Installation

```sh
npm install --save-dev svg-sprite-webpack-plugin
```

## Usage

### Webpack config

```javascript
const IconPlugin = require('svg-sprite-webpack-plugin').plugin;

// NOTE:
// Usage with the included webpack-isomorphic-tools parser requires that
// the extracted filename match this format.
const iconPlugin = new IconPlugin('icons-[hash].svg');

// ... inside the configuration object
{
  module: {
    loaders: [
      {
        test: /\.svg$/,
        loader: iconPlugin.extract(),
      }
    ]
  },
  plugins: [
    iconPlugin,
  ],
}
```

### Webpack isomorphic tools

If using [webpack-isomorphic-tools](https://www.npmjs.com/package/webpack-isomorphic-tools),
add this to your config:

```javascript
const iconParser = require('svg-sprite-webpack-plugin').webpackIsomorphicParser;

{
  assets: {
    svg: {
      extension: 'svg',
      parser: iconParser,
    }
  }
}
```

### In code

An example using React 0.14 or later:

```jsx
import { Component } from 'react';
import myGreatIcon from './my-great-icon.svg';

class SuperGreatIconComponent extends Component {
  render() {
    return (
      <svg><use xlinkHref={myGreatIcon} /></svg>
    );
  }
}
```

### Suggested development mode config

If you're using the webpack-dev-server, it's advised to not use this plugin, and
instead go directly to `svg-sprite-loader`.

```javascript
const iconTest = /\.svg$/;
if (DEV) {
  config.module.loaders.push({
    test: iconTest,
    loader: 'svg-sprite',
  });
} else {
  config.module.loaders.push({
    test: iconTest,
    loader: iconPlugin.extract(),
  });
}
```

## Usage Caveats

### Internet Explorer

Internet Explorer does not support `<use>` tags with external references.
This has been [fixed](https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer/suggestions/6263916-svg-external-content) in Microsoft Edge 13, but until Edge's browser share gets to an acceptable level for you, I suggest using jonathantneal's excellent [SVG4Everybody](https://github.com/jonathantneal/svg4everybody) library.

### CDNs

`<use>` tags do not allow cross-origin requests, and from what I could tell,
aren't likely to start supporting them any time soon. Because of this, instead
of using the `output.publicPath` webpack config, this library is currently
expecting that the generated icons svg will be accessible inside the `/static`
directory on the same domain as the website using the imported icons.

## Development

This was originally developed to be used in-house, so I expect there are a number
of usecases that are not being adequately covered. Issues and PRs are welcome!

Install dependencies:

```sh
npm install --global yarn
yarn install
```

Make sure any code passes tests and the linter before submitting a PR!

```sh
yarn test
yarn run lint
```

## Meta

Distributed under the MIT License. See ``LICENSE`` for more information.

Developers:

_[Jeremy Tice](https://github.com/jetpacmonkey)_
[@jetpacmonkey](https://twitter.com/jetpacmonkey)

[npm-image]: https://img.shields.io/npm/v/svg-sprite-webpack-plugin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/svg-sprite-webpack-plugin
[npm-downloads]: https://img.shields.io/npm/dm/svg-sprite-webpack-plugin.svg?style=flat-square
[circle-image]: https://img.shields.io/circleci/project/github/TodayTix/svg-sprite-webpack-plugin.svg?style=flat-square
[circle-url]: https://circleci.com/gh/TodayTix/svg-sprite-webpack-plugin
