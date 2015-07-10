(function(root){

	'use strict';

	var Utils = function(){
	}

	Utils.getEventxy = function(evt){
		return { x: evt.originalEvent.layerX, y: evt.originalEvent.layerY };
	}

	Utils.getSvgCircleCenter = function(circle){
		return {
			x: $(circle).attr('cx'),
			y: $(circle).attr('cy')
		};
	}

	Utils.stringEndsWith = function(str, suffix){
		return str.toLowerCase().indexOf(suffix.toLowerCase(), str.length - suffix.length) !== -1;
	}

	Utils.isPointLiesBetween = function(p, a, b){
		// Does point p lie on the line joining a and b?

		var a2p = getUnitVectorFromAtoB(a, p);
		var p2b = getUnitVectorFromAtoB(p, b);

		return areApproximatelyEqual(a2p.x, p2b.x) && areApproximatelyEqual(a2p.y, p2b.y);
	}

	function getUnitVectorFromAtoB(a, b){

		var mag = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

		var x = (b.x - a.x) / mag;
		var y = (b.y - a.y) / mag;

		return { x: x, y: y };

	}

	function areApproximatelyEqual(a, b){
		var feather = 0.035;
		return Math.abs(a - b) < feather;
	}

	root.Utils = Utils;

})(window);