'use strict';

var ko = require('knockout');
var CodeMirror = require('code-mirror');
var themes = require('code-mirror/theme');

module.exports = enableCM;
function enableCM(defaults) {
  var events = {
    'editor-created': [],
    'editor-disposed': []
  };

  ko.bindingHandlers.codemirror = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var options = ko.toJS(valueAccessor());
      for (var key in defaults) {
        if (options[key] === undefined) {
          options[key] = defaults[key];
        }
      }
      if (options.theme && !themes.available(options.theme) && typeof console === 'object' && console) {
        console.error(options.theme + ' may not be an available theme.');
      }
      options.value = options.value || '';
      var editor = new CodeMirror(element, options);
      editor.on('change', function (cm) {
        var value = ko.unwrap(valueAccessor()).value;
        if (ko.isObservable(value)) {
          value(cm.getValue());
        } else {
          ko.unwrap(valueAccessor()).value = cm.getValue();
        }
      });
      var subscription;
      if (ko.isObservable(valueAccessor().value)) {
        subscription = valueAccessor().value.subscribe(function () {
          if (editor.getValue() !== valueAccessor().value())
            editor.setValue(valueAccessor().value());
        });
      }
      for (var i = 0; i < events['editor-created'].length; i++) {
        events['editor-created'][i](editor, element, options);
      }
      for (var key in events) {
        if (key !== 'editor-created' && key !== 'editor-disposed') {
          for (var i = 0; i < events[key].length; i++) {
            editor.on(key, events[key][i]);
          }
        }
      }

      var wrapperElement = $(editor.getWrapperElement());
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        for (var i = 0; i < events['editor-disposed'].length; i++) {
          events['editor-disposed'][i](editor, element, options);
        }
        wrapperElement.remove();
        if (subscription) {
          subscription.dispose();
        }
      });
    }
  };

  return {
    on: function (name, fn) {
      events[name] = events[name] || [];
      if (events[name].indexOf(fn) === -1) {
        events[name].push(fn);
      }
      return this;
    },
    off: function (name, fn) {
      if (name !== 'editor-created' && name !== 'editor-disposed') {
        throw new Error('`off` is not supported when proxying to CodeMirror events');
      }
      events[name] = events[name] || [];
      events[name] = events[name].filter(function (f) {
        return f !== fn;
      })
      return this;
    }
  }
}