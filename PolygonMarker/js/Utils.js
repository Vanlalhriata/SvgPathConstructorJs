(function(root){

	//'use strict';

	var Utils = function(){
	}

	Utils.getEventxy = function(evt){
		// Fix for Firefox
		if (typeof evt.offsetX != 'undefined')
			return { x: evt.offsetX, y: evt.offsetY };
		else
			return { x: evt.originalEvent.layerX, y: evt.originalEvent.layerY };
	}

	Utils.stringEndsWith = function(str, suffix){
		return str.toLowerCase().indexOf(suffix.toLowerCase(), str.length - suffix.length) !== -1;
	}

	root.Utils = Utils;

})(window);