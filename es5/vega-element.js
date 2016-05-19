'use strict';

(function () {
  'use strict';
  /**
   *  Custom element that wraps around [Vega](https://github.com/vega/vega).
   *
   *  ### Example code
   *  ```
   *    <vega-element class="shadow"
   *      renderer="svg"
   *      spec="./vega-spec.json">
   *        <h1 class="top">Vega Element</h1>
   *    </vega-element>
   *  ```
   *
   *  The following classes can be applied on *light DOM* to control the insertion points for **vega-element**:
   *
   *  Class | Description
   *  :--- | :---
   *  `top` | Inserts above the Vega canvas/svg
   *  `bottom` | Inserts below the Vega canvas/svg
   *  `left` | Inserts to the left of the Vega canvas/svg
   *  `right` | Inserts to the right of the Vega canvas/svg
   *
   *  The following class can be applied to the **vega-element** for styling:
   *
   *  Class | Description
   *  :--- | :---
   *  `shadow` | Applies a shadow effect
   *
   *  The following custom properties and mixins are also available for styling:
   *
   *  Custom property | Description | Default
   *  :--- | :--- | :---
   *  `--vega-bgcolor` | Background color of the Vega element | `#FAFAFA`
   *
   *  @demo demo/index.html
   */

  Polymer({
    is: 'vega-element',

    properties: {},
    behaviors: [Polymer.NeonAnimatableBehavior, Hiveoss.VegaBehavior],
    observers: ["render(_chart)"],
    /*
     * Renders Vega.
     */
    render: function render(_chart, data) {
      data = data || this.data;
      var self = this,
          el = this.$.vega,
          renderer = this.renderer;

      this.view = _chart({
        el: el,
        data: data,
        renderer: renderer
      }).update();

      this.loading = false;
    }
  });
})();