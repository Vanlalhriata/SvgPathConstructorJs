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
		var dString = this.$path.attr('d');
		dString = dString.trim();
		if (!Utils.stringEndsWith(dString, "z"))
			dString += " z";

		this.$path.attr('d', dString);
		this.isPathClosed = true;
	}

	function initialise(that){

		that.$path = $(document.createElementNS('http://www.w3.org/2000/svg' ,'path'));
		that.$path.attr('class', 'selection-path');

		that.$markersSvg.append(that.$path);

		that.$markersSvg.on('mousedown', function(evt){ onSvgMouseDown(evt, that) });
		that.$markersSvg.on('mouseup', function(evt){ onSvgMouseUp(evt, that) });
		that.$markersSvg.on('mousemove', function(evt){ onSvgMouseMove(evt, that) });

		// disable right-click
		that.$markersSvg.on('contextmenu', function(){ return false; });
	}

	function onSvgMouseDown(evt, that){
		if (evt.which == 1){	// left click

			var eventxy = Utils.getEventxy(evt);

			var $newMarker = $(document.createElementNS('http://www.w3.org/2000/svg' ,'circle'));
			$newMarker.attr('cx', eventxy.x);
			$newMarker.attr('cy', eventxy.y);
			$newMarker.attr('class', 'marker');

			$newMarker.on('mousedown', function(evt){ onMarkerMouseDown(evt, that, this); })

			that.$markersSvg.append($newMarker);
			that.$dragMarker = $newMarker;
			updatePath(that);
		}
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
			var markers = $(".marker", that.$markersSvg); 
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

		var marker = $(".marker", that.$markersSvg);
		marker.each(function(index, marker){
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

	PolygonMarker.prototype = {
		setReferenceImage: setReferenceImage,
		closePath: closePath
	}

	root.PolygonMarker = PolygonMarker;

})(window);