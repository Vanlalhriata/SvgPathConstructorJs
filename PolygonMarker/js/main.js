'use strict';

var polygonMarker = new PolygonMarker($("#markersSvg"));
polygonMarker.setReferenceImage($("#referenceImage"));

// This will consider only M, L and z commands. (and not m or l)
polygonMarker.setSvgPathData("M637,251 L1117,232 L1048,402 L605,414 z");

$(".btn-closePath").on('click', function() { polygonMarker.closePath(); });

$(".btn-getPathData").on('click', function() {

	var pathData = polygonMarker.getSvgPathData();

	if (pathData.error)
		$("#msg").html(pathData.error);
	else
		$("#msg").html(pathData.data);
});