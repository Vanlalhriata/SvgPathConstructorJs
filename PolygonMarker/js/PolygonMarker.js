(function(root){

	'use strict';

	var PolygonMarker = function($markersSvg){

		if (typeof $markersSvg == 'undefined')
			console.error("PolygonMarker: markersSvg needs to be assigned at the constructor.")

		this.$markersSvg = $markersSvg;
		this.$path = null;

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
		that.$path.attr('d', 'M10,10 L100,10 L100,100');

		that.$markersSvg.append(that.$path);

		that.$markersSvg.on('mousedown', onMouseDown);
		that.$markersSvg.on('contextmenu', function(){ return false; });

	}

	function onMouseDown(evt){
	}

	PolygonMarker.prototype = {
		setReferenceImage: setReferenceImage
	}

	root.PolygonMarker = PolygonMarker;

})(window);