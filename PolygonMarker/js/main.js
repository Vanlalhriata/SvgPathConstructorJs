'use strict';

var polygonMarker = new PolygonMarker($("#markersSvg"));
polygonMarker.setReferenceImage($("#referenceImage"));

$(".btn-closePath").on('click', function() { polygonMarker.closePath(); });