# knockout-code-mirror

Knockout bindings for the code-mirror editor

[![Build Status](https://img.shields.io/travis/ForbesLindesay/knockout-code-mirror/master.svg)](https://travis-ci.org/ForbesLindesay/knockout-code-mirror)
[![Dependency Status](https://img.shields.io/david/ForbesLindesay/knockout-code-mirror.svg)](https://david-dm.org/ForbesLindesay/knockout-code-mirror)
[![NPM version](https://img.shields.io/npm/v/knockout-code-mirror.svg)](https://www.npmjs.com/package/knockout-code-mirror)

## Installation

    npm install knockout-code-mirror

N.B. This module peer depends on `code-mirror` and `knockout`.  It will fail to install if you are not using the same version of knockout and code-mirror as this module.  You will need to require in whichever themes and modes you want from code-mirror (see [code-mirror documentation](https://github.com/ForbesLindesay/code-mirror))

## Example

To use, simply use the `codemirror` data binding:

```html
<div data-bind="codemirror: { value: sourceText, mode: 'sql' }"></div>
```

```javascript
var ko = require('knockout');
var enableCM = require('knockout-code-mirror');
require('code-mirror/mode/sql');
require('code-mirror/theme/monokai');

//set defaults for the binding
enableCM({
  theme: 'monokai'
}).on('keyup', function (cm) {
  console.log('keyup event on:');
  console.dir(cm);
});

ko.applyBindings({
  sourceText: 'SELECT * FROM CodeMirrorModes'
});
```

## Events

All the builtin code mirror events are proxied for `on` (but not for `off`).  In addition, the following events are fired:

 - `editor-created(editor, parentElement, options)` - fired when a new editor is created
 - `editor-disposed(editor, parentElement, options)` - fired when an editor is disposed (so you can do cleanup).

## License

  MIT