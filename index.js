var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var notas = [{pos:0, tarea:'estudiar java', prioridad:2, fecha_creacion:"54", completada:true, user:'anonimo1'},
		{pos:1, tarea:'aprender PHP', prioridad:1, fecha_creacion:"54", completada:false, user:'anonimo2'}];
io.on('connection', function(socket){
	var addedUser = false;
	socket.on('add user', (username) => {
		socket.emit('actualizar', JSON.stringify(notas));
		if (addedUser) return;
		socket.username = username;
		addedUser = true;
	});
	socket.on('actualizar', (arrayNotas) => {
		notas=JSON.parse(arrayNotas);
		socket.broadcast.emit('actualizar', (arrayNotas));
	});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
