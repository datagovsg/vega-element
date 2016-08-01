# vega-element

A [PolymerJS](https://www.polymer-project.org) custom element for rendering interactive data visualization - powered by [Vega](https://github.com/vega/vega).

# bower
```
bower install vega-element
```

# important note

You need to import the d3, d3-layout-cloud, geo-projection, topojson dependencies separately (in the right order) for vega to include the plugins properly.

e.g. 
```
<link rel="import" href="./d3.html">
<link rel="import" href="./d3-layout-cloud.html">
<link rel="import" href="./vega-element.html">

```

# documentation

Details and demo can be found at the [Component Page](https://datagovsg.github.io/vega-element)
