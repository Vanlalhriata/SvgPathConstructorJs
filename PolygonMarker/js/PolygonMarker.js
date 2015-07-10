(function(root){

	'use strict';

	var PolygonMarker = function($markersSvg){

		if (typeof $markersSvg == 'undefined')
			console.error("PolygonMarker: markersSvg needs to be assigned at the constructor.")

		this.$markersSvg = $markersSvg;
		this.$path = null;
		this.isPathClosed = false;
		this.$dragMarker = null;

		initialise(this);
	}

	var setReferenceImage = function($referenceImage){
		
		if (typeof $referenceImage == 'undefined')
			console.error("PolygonMarker: referenceImage is not provided");

		this.$markersSvg.width($referenceImage.width());
		this.$markersSvg.height($referenceImage.height());

	}

	var closePath = function(){

		if ($(".marker", this.$markersSvg).length < 3)
			return;

		var dString = this.$path.attr('d');
		dString = dString.trim();
		if (!Utils.stringEndsWith(dString, "z"))
			dString += " z";

		this.$path.attr('d', dString);
		this.isPathClosed = true;
	}

	var getSvgPathData = function(){

		if (!this.isPathClosed)
			this.closePath();

		var dString = "";
		var error = null;

		if (!this.isPathClosed)
			error = "At least three markers are needed to form a closed path";
		else
			dString = this.$path.attr('d');

		return {
			error: error,
			data: dString
		};
	}

	function initialise(that){

		that.$path = $(document.createElementNS('http://www.w3.org/2000/svg' ,'path'));
		that.$path.attr('class', 'selection-path');

		that.$path.attr('stroke', '#f20');
		that.$path.attr('stroke-width', '3');
		that.$path.attr('fill', 'transparent');

		that.$markersSvg.append(that.$path);

		that.$path.on('mousedown', function(evt) { onPathMouseDown(evt, that); });

		that.$markersSvg.on('mousedown', function(evt){ onSvgMouseDown(evt, that); });
		that.$markersSvg.on('mouseup', function(evt){ onSvgMouseUp(evt, that); });
		that.$markersSvg.on('mousemove', function(evt){ onSvgMouseMove(evt, that); });

		// disable right-click
		that.$markersSvg.on('contextmenu', function(){ return false; });
	}

	function onSvgMouseDown(evt, that){
		if (evt.which == 1){	// left click
			var eventxy = Utils.getEventxy(evt);
			createMarker(that, eventxy);
		}
	}

	function createMarker(that, point, markerBefore){

		var $newMarker = $(document.createElementNS('http://www.w3.org/2000/svg' ,'circle'));
		$newMarker.attr('cx', point.x);
		$newMarker.attr('cy', point.y);
		$newMarker.attr('class', 'marker');

		$newMarker.attr('r', '5');
		$newMarker.attr('fill', '#0bf');
		$newMarker.attr('stroke', '#222');

		$newMarker.on('mousedown', function(evt){ onMarkerMouseDown(evt, that, this); })

		if (typeof markerBefore == 'undefined')
			that.$markersSvg.append($newMarker);
		else
			$newMarker.insertAfter($(markerBefore));

		that.$dragMarker = $newMarker;
		updatePath(that);

	}

	function onSvgMouseUp(evt, that){
		that.$dragMarker = null;
	}

	function onSvgMouseMove(evt, that){
		if (null != that.$dragMarker){

			var eventxy = Utils.getEventxy(evt);

			that.$dragMarker.attr('cx', eventxy.x);
			that.$dragMarker.attr('cy', eventxy.y);
			updatePath(that);
		}
	}

	function onMarkerMouseDown(evt, that, marker){
		if (evt.which == 1)			// left click
			that.$dragMarker = $(marker);
		else if (evt.which == 3){	// right-click to delete

			// Open path if first or last marker
			var markers = getAllMarkers();
			if (markers.last().get(0) == marker || markers.first().get(0) == marker)
				that.isPathClosed = false;

			$(marker).remove();
			updatePath(that);
		}

		evt.stopPropagation();
	}

	function updatePath(that){

		var dString = "";
		var operation = "";

		var markers = getAllMarkers();
		markers.each(function(index, marker){
			if (index == 0)
				operation = "M";
			else
				operation = "L";

			dString += operation + $(marker).attr('cx') + "," + $(marker).attr('cy') + " ";
		});

		if (that.isPathClosed)
			dString += " z";

		that.$path.attr('d', dString);
	}

	function onPathMouseDown(evt, that){

		evt.stopPropagation();

		var clickPoint = Utils.getEventxy(evt);
		var markers = getAllMarkers();
		var markerBefore = null;

		markers.each(function(index, marker){

			var firstPoint = Utils.getSvgCircleCenter(markers[index]);
			var secondPoint = Utils.getSvgCircleCenter(markers[(index + 1) % markers.length]);

			if (Utils.isPointLiesBetween(clickPoint, firstPoint, secondPoint)){
				markerBefore = marker;
				return false;	// break
			}

		});

		if (null != markerBefore)
			createMarker(that, clickPoint, markerBefore);

	}

	function getAllMarkers(){
		// HACK: looking everywhere for markers instead of only $markersSvg
		// because Internet Explorer
		return $('.marker');
	}

	PolygonMarker.prototype = {
		setReferenceImage: setReferenceImage,
		closePath: closePath,
		getSvgPathData: getSvgPathData
	}

	root.PolygonMarker = PolygonMarker;

})(window);