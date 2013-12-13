// var debug = require('debug')('test2');

module.exports = function (io) {
	var debug = require('debug')('handler2');
	debug('setting up socket.io...');

	console.log('setting up socket.io...');
	io.of('/gantt')
		.on('connection', function(socket) {
			socket.emit('connected', 'connected');
			socket.broadcast.emit('connected', 'another user connected');

			socket.on('create', function(task) {
				socket.broadcast.emit('create', task);
			});

			socket.on('update', function(task) {
				socket.broadcast.emit('update', task);
			});

			socket.on('delete', function(task) {
				socket.broadcast.emit('delete', task);
			});
		});
};