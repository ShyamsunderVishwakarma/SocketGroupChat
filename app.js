var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/static',express.static('public'));


app.get('/', function(req, res) {
  res.sendfile('./view/index.html');
});

var usernames={};

var liveusercount = 0;

io.sockets.on('connection',function(socket){

	socket.on('adduser',function(data){
		
		liveusercount++;

		var username = data.username;
		socket.username = username;
		usernames[username]= username;
		socket.emit('updatechat',username,'you can start chat!',liveusercount);
		socket.broadcast.emit('updatechat','Admin',username + ' Connected!!!',liveusercount);
	});

	socket.on('sendchat',function(data){
		io.sockets.emit('updatechat',socket.username,data,liveusercount);
	})

	socket.on('disconnect',function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers',usernames);

		if(socket.username !== undefined)
		{
			liveusercount--;
			socket.broadcast.emit('updatechat','Adim',socket.username + ' Disconnected!!!',liveusercount)
		}

	})

})

http.listen('8080',function(){
	console.log("server started at port 8080!");
})