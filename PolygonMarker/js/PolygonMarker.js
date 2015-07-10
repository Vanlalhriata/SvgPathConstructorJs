(function(root){

	'use strict';

	var PolygonMarker = function($markersSvg){

		if (typeof $markersSvg == 'undefined')
			console.error("PolygonMarker: markersSvg needs to be assigned at the constructor.")

		this.$markersSvg = $markersSvg;
		this.$path = null;
		this.isPathClosed = false;
		this.$dragCircle = null;

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

			var eventxy = Utils.getEventxy(evt);

			var $newCircle = $(document.createElementNS('http://www.w3.org/2000/svg' ,'circle'));
			$newCircle.attr('r', '5');
			$newCircle.attr('cx', eventxy.x);
			$newCircle.attr('cy', eventxy.y);
			$newCircle.attr('fill', '#22c');
			$newCircle.attr('stroke', 'black');

			$newCircle.attr('class', 'temp');

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

			var eventxy = Utils.getEventxy(evt);

			that.$dragCircle.attr('cx', eventxy.x);
			that.$dragCircle.attr('cy', eventxy.y);
			updatePath(that);
		}
	}

	function onCircleMouseDown(evt, that, circle){
		if (evt.which == 1)			// left click
			that.$dragCircle = $(circle);
		else if (evt.which == 3){	// right-click to delete

			// Open path if first or last marker
			var circles = $("circle", that.$markersSvg); 
			if (circles.last().get(0) == circle || circles.first().get(0) == circle)
				that.isPathClosed = false;

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