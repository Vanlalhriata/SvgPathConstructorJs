(function(root){

	'use strict';

	var PolygonMarker = function($markersSvg){

		if (typeof $markersSvg == 'undefined')
			console.error("PolygonMarker: markersSvg needs to be assigned at the constructor.")

		this.$markersSvg = $markersSvg;
		this.$path = null;
		this.$dragCircle = null;

		initialise(this);
	}

	var setReferenceImage = function($referenceImage){
		
		if (typeof $referenceImage == 'undefined')
			console.error("PolygonMarker: referenceImage is not provided");

		this.$markersSvg.width($referenceImage.width());
		this.$markersSvg.height($referenceImage.height());

	}

	function initialise(that){

		that.$path = $(document.createElementNS('http://www.w3.org/2000/svg' ,'path'));
		that.$path.attr('stroke', 'red');
		that.$path.attr('stroke-width', '2');
		that.$path.attr('fill', 'transparent');
		that.$path.attr('fill-opacity', '0.3');

		that.$markersSvg.append(that.$path);

		that.$markersSvg.on('mousedown', function(evt){ onSvgMouseDown(evt, that) });
		that.$markersSvg.on('mouseup', function(evt){ onSvgMouseUp(evt, that) });
		that.$markersSvg.on('mousemove', function(evt){ onSvgMouseMove(evt, that) });

		// disable right-click
		that.$markersSvg.on('contextmenu', function(){ return false; });
	}

	function onSvgMouseDown(evt, that){
		if (evt.which == 1){	// left click

			var eventxy = getEventxy(evt);

			var $newCircle = $(document.createElementNS('http://www.w3.org/2000/svg' ,'circle'));
			$newCircle.attr('r', '5');
			$newCircle.attr('cx', eventxy.x);
			$newCircle.attr('cy', eventxy.y);
			$newCircle.attr('fill', '#22c');
			$newCircle.attr('stroke', 'black');

			$newCircle.on('mousedown', function(evt){ onCircleMouseDown(evt, that, this); })

			that.$markersSvg.append($newCircle);
			that.$dragCircle = $newCircle;
			updatePath(that);
		}
	}

	function onSvgMouseUp(evt, that){
		that.$dragCircle = null;
	}

	function onSvgMouseMove(evt, that){
		if (null != that.$dragCircle){

			var eventxy = getEventxy(evt);

			that.$dragCircle.attr('cx', eventxy.x);
			that.$dragCircle.attr('cy', eventxy.y);
			updatePath(that);
		}
	}

	function onCircleMouseDown(evt, that, circle){
		if (evt.which == 1)			// left click
			that.$dragCircle = $(circle);
		else if (evt.which == 3){	// right-click to delete
			$(circle).remove();
			updatePath(that);
		}

		evt.stopPropagation();
	}

	function updatePath(that){

		var dString = "";
		var operation = "";

		var circles = $("circle", that.$markersSvg);
		circles.each(function(index, circle){
			if (index == 0)
				operation = "M";
			else
				operation = "L";

			dString += operation + $(circle).attr('cx') + "," + $(circle).attr('cy') + " ";
		});

		that.$path.attr('d', dString);
	}

	function getEventxy(evt){
		if (typeof evt.offsetX != 'undefined')
			return { x: evt.offsetX, y: evt.offsetY };
		else
			return { x: evt.originalEvent.layerX, y: evt.originalEvent.layerY };
	}

	PolygonMarker.prototype = {
		setReferenceImage: setReferenceImage
	}

	root.PolygonMarker = PolygonMarker;

})(window);