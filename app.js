var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/static',express.static('public'));

//homepage
app.get('/', function(req, res) {
  res.sendfile('./view/index.html');
});

var usernames={};

var liveusercount = 0;

//open connection
io.sockets.on('connection',function(socket){

	//add user
	socket.on('adduser',function(data){
		
		liveusercount++;

		var username = data.username;
		socket.username = username;

		socket.emit('updatechat',username,'you can start chat!',liveusercount);
		socket.broadcast.emit('updatechat','Admin',username + ' Connected!!!',liveusercount);
	});

	//send message
	socket.on('sendchat',function(data){
		io.sockets.emit('updatechat',socket.username,data,liveusercount);
	})

	//on tab close
	socket.on('disconnect',function(){
		io.sockets.emit('updateusers',usernames);

		if(socket.username !== undefined)
		{
			liveusercount--;
			socket.broadcast.emit('updatechat','Adim',socket.username + ' Disconnected!!!',liveusercount)
		}

	})

})

//server started
http.listen('8080',function(){
	console.log("server started at port 8080!");
})