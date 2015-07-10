'use strict';

var polygonMarker = new PolygonMarker($("#markersSvg"));
polygonMarker.setReferenceImage($("#referenceImage"));

$(".btn-closePath").on('click', function() { polygonMarker.closePath(); });

$(".btn-getPathData").on('click', function() {

	var pathData = polygonMarker.getSvgPathData();

	if (pathData.error)
		$("#msg").html(pathData.error);
	else
		$("#msg").html(pathData.data);
});