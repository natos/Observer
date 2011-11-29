
/**
 *	Namespace
 */

var o = {};
	o.pointers = {};

/**
 *	Cookies
 */
//	$.cookie('pointer',null);
	
	if ( $.cookie('pointer') ) {
		o._id = $.cookie('pointer');
	} else {
		o._id = 'pointer' + Math.floor(Math.random()*16777215).toString(16);
		$.cookie('pointer', o._id);
	}

/**
 *	Utils
 */
var getMousePosition = function(e) {

	// From http://www.quirksmode.org/js/events_properties.html

	var posx = 0;
	var posy = 0;

	if (!e) var e = window.event;

	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}

	return { 
		posx: posx,
		posy: posy
	}
}

/**
 *	Controls
 */

var createPointerControl =  function(e) {

	var id = e._id;

	if ( o.pointers[id] ) {
		return;
	}

	o.pointers[id] = $('<div id="' + id + '">')
		.css({
			'background-color': '#' + id.split('pointer').join(''),
			'width': '5px',
			'height': '5px',
			'position': 'absolute'
		})
		.addClass('pointer')
		.appendTo('body');
};

var userMovingControl = function(e) {

		var id = e._id, w, h,
			posx = e.data.posx,
			posy = e.data.posy;

		if ( !o.pointers[id] ) {
			createPointerControl(e);
			return;
		}

		w = o.pointers[id].css('width').split('px').join('');
		h = o.pointers[id].css('height').split('px').join('');

		o.pointers[id].css({
			'top': posy - h + 'px',
			'left': posx - w + 'px'
		});
};

var clickedControl = function(e) {

	var id = e._id, w, h,
		posx = e.data.posx,
		posy = e.data.posy
		type = e.event;
		itemId = e.itemId;

	if ( !o.pointers[id] ) {		
		return;
	}

	if (itemId) {
		$('#' + itemId).blink();
	}

	w = o.pointers[id].css('width').split('px').join('');
	h = o.pointers[id].css('height').split('px').join('');

	if (type === 'mousedown') {
		o.pointers[id].addClass('clicked').css({
			'width': '10px',
			'height': '10px',
			'top': posy - (h/2) + 'px',
			'left': posx - (w/2) + 'px'
		}).removeClass('clicked');
	} else {
		o.pointers[id].css({
			'width': '5px',
			'height': '5px',
			'top': posy + 'px',
			'left': posx + 'px'
		});
	}
};

/**
 *	Sockets
 */
	o.socket = io.connect('http://localhost');

	// Connected
	o.socket.on('connect', function (e) {
    	o.socket.emit('connected', o._id);
	});

	o.socket.on('create pointer', createPointerControl);

	o.socket.on('user moving', userMovingControl);

	o.socket.on('clicked', clickedControl);



/**
 *	Events
 */

// Mouse move event
$(window).mousemove(function(e) {
	o.socket.emit("moving", o._id, getMousePosition(e) );
});
// Mouse click
var clicking = function(e) {
	var itemId = $(e.target).parents('li').attr('id');
	o.socket.emit("clicking", o._id, getMousePosition(e), e.type, itemId );
};
// Mousedown // Mouseup
$(window).mousedown(clicking).mouseup(clicking);
