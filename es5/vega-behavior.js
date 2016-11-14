'use strict';

(function (Hiveoss) {

  /**
   * Use `Polymer.NeonSharedElementAnimatableBehavior` to implement elements containing shared element
   * animations.
   * @polymerBehavior Polymer.NeonSharedElementAnimatableBehavior
   */
  Hiveoss.VegaBehavior = {
    properties: {
      /*
       * Notifies whether Vega is still busy.
       * As there the DOM listener for SVG is not currently implemented, **loading** will not reflect the status of SVG rendering.
       * As *Canvas* rendering is sync, **loading** will reflect then completion of Canvas rendering.
       */
      loading: {
        type: Boolean,
        readonly: true,
        notify: true,
        value: false
      },
      /*
       * String or an Array of String. Specify the name of the datasets to retrieve from Vega.
       * The datasets will be return as attribute **last-data**.
       */
      requestData: {
        type: Object
      },
      /*
       * Object-map of the dataset requested in attribute **request-data**. The keys are the dataset names.
       */
      lastData: {
        type: Object,
        notify: true,
        readonly: true
      },
      /*
       * An object containing named data sets. The data argument can be used to bind data sets at runtime for dynamic, reusable chart components. Data sets whose names do not match any data definitions in the Vega specification will be ignored.
       *
       * details: https://github.com/vega/vega/wiki/Runtime
       */
      data: {
        type: Object
      },
      /*
       * Vega view object.
       *
       * details: https://github.com/vega/vega/wiki/Runtime
       */
      view: {
        type: Object,
        readonly: true,
        notify: true
      },
      /*
       * Vega JSON specification or a URL.
       *
       * details: https://github.com/vega/vega/wiki
       */
      spec: {
        type: Object
      },
      /*
       * The renderer to use - **canvas** or **svg**.
       */
      renderer: {
        type: String,
        value: 'canvas'
      },
      /*
       * Updates a Vega signal with an object **{signal,value}**, where signal is the signal to update, and value is the value to update with.
       */
      signal: {
        type: Object
      },
      /*
       * Vega signals to observe - will fire a **signal** event and return an object **{signal,value}**.
       *
       * e.g.
       * ```
       * <vega-element observe-signals="[[signals]]"
       *    on-signal="handleSignal"
       *    last-signal="{{lastSignal}}"></vega-element>
       * ```
       */
      observeSignals: {
        type: Array,
        observer: '_observeSignalsChanged'
      },
      /*
       * The latest signal based on the signals specified in observer-signals.
       * Return an object **{signal,value}**.
       */
      lastSignal: {
        type: Object,
        readonly: true,
        notify: true
      },
      /*
       * The easing to use for transition.
       * See d3 v3 easing doc for possible values:
       * [https://github.com/d3/d3-3.x-api-reference/blob/master/Transitions.md#easing](https://github.com/d3/d3-3.x-api-reference/blob/master/Transitions.md#easing)
       */
      ease: {
        type: String,
        value: 'in-out'
      },
      /*
       * The duration in milliseconds to use for transition.
       */
      duration: {
        type: Number,
        value: 300
      },
      /*
       * Vega chart object.
       *
       * details: https://github.com/vega/vega/wiki/Runtime
       */
      _chart: {
        type: Object
      },
      _diff: {
        type: Object
      }
    },

    observers: ["parse(spec)", "updateSignal(signal,view)", "getData(requestData,view)", "_updateSignalListeners(_diff.added,_diff.removed,view)", '_updateData(view,data)'],

    /*
     * Parse a Vega JSON specification or URL. Updates the **_chart** attribute.  Automatically called when **spec** is updated.
     */
    parse: function parse(spec) {
      if (!spec) return;
      this.loading = true;
      var self = this;
      vg.parse.spec(spec, function (error, chart) {
        self._chart = chart;
      });
    },

    /*
     * Updates a Vega signal. 1st argument takes in a {signal,value} Object, where signal is the signal to update, and value is the value to update with.
     * The 2nd argument is the optional **view** Object.
     */
    updateSignal: function updateSignal(signal, view) {
      if (!signal) return;
      view = view || this.view;
      if (!view) return;
      var self = this;
      this.loading = true;
      view.signal(signal.signal, signal.value).update({ duration: this.duration, ease: this.ease });
      this.async(function () {
        self.getData(self.requestData, self.view);
      }, 500);
      this.loading = false;
    },

    /*
     * Retrieve datasets from Vega. 1st argument is either the dataset name or an Array of dataset names.
     * Return a Object-map with the dataset names as keys.
     */
    getData: function getData(dataname, view) {
      if (!dataname) return;
      view = view || this.view;
      if (!view) return;
      var res = {};
      var datanames = Array.isArray(dataname) ? dataname : [dataname];
      datanames.forEach(function (d) {
        res[d] = view.data(d).values();
      });
      this.set('lastData', res);
      return this.lastData;
    },

    _updateData: function _updateData(view, data) {
      if (!view || !data) return;
      view.data(data).update({ duration: this.duration, ease: this.ease });
    },

    _observeSignalsChanged: function _observeSignalsChanged(val, old) {
      this._diff = this._difference(val, old);
    },

    _difference: function _difference(currArr, oldArr) {
      var map = new Map();
      // set new values to be 1
      currArr = currArr || [];
      currArr.forEach(function (d) {
        return map.set(d, 1);
      });
      // set existing values to 3, and removed values to be 2
      oldArr = oldArr || [];
      oldArr.forEach(function (d) {
        return map.set(d, map.has(d) ? 3 : 2);
      });
      // extract into 2 array, new values, and removed values
      var added = [],
          removed = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = map[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var k = _step.value;

          if (k[1] === 1) added.push(k[0]);
          if (k[1] === 2) removed.push(k[0]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return { added: added, removed: removed };
    },


    _updateSignalListeners: function _updateSignalListeners(add, remove, view) {
      view = view || this.view;
      if (!view) return;
      var self = this;

      add.forEach(function (d) {
        view.onSignal(d, function (signal, value) {
          var res = { signal: signal, value: value };
          self.lastSignal = res;
          self.fire('signal', res);
        });
      });

      remove.forEach(view.offSignal);
    }

  };
})(window.Hiveoss = window.Hiveoss || {});