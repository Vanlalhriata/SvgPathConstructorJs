# SVG Path constructor JS

`PolygonMarker` is a class that provides a GUI system to construct an SVG path data. The end user places a series of markers to form the path.

#### End user interactions:
* Click on an empty space to create a marker connected to the previous one (if any)
* Drag  a marker to change its position (and hence the path)
* Click on the path to insert a new marker
* Right-click on a marker to delete it

#### Usage:

A predefined `svg` element is needed to hold the visuals:
```javascript
var polygonMarker = new PolygonMarker($("#markersSvg"));
```

A reference image can be provided. Doing this automatically resizes the `svg` element to the image's size:
```javascript
polygonMarker.setReferenceImage($("#referenceImage"));
```

The path data can be `set` or `get`:
```javascript
polygonMarker.setSvgPathData("M10,10 L50,10 L50,50 z");
var pathData = polygonMarker.getSvgPathData();  // { error: null, data: "M10,10 L50,10 L50,50 z" }
```

The path can be closed on demand:
```javascript
polygonMarker.closePath();
```

#### License:

MIT License