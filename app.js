var express = require('express');
var app= express();
var server = require('http').createServer(app);
var io= require('socket.io').listen(server);
//var mongoose = require('mongoose');
var users={};

server.listen(3000);

// mongoose.connect('mongodb://localhost/chat', function(err){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log('Connected to mongodb');
// 	}
// });

// var chatSchema = mongoose.Schema({
// 	nick: String,
// 	msg: String,
// 	created: {type: Date, default: Date.now}
// });

// var Chat = mongoose.model('Message',chatSchema);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
  });

io.sockets.on('connection',function(socket){
	//var query= Chat.find({});
	//query.sort('-created').limit(8).exec(function(err, docs){
	//	if(err) throw err;
	//	console.log('Sending old messages');
	//	socket.emit('load old messages',docs);
	//});
	//socket.join('some room');
	socket.on('new user', function(data,callback){
		if (data in users) {
			callback(false);
			}
		else{
			callback(true);
			socket.nickname = data;
			users[socket.nickname]=socket;
			//console.log(users[socket.nickname]);
			updateNicknames();
			}
	});

	function updateNicknames(){
		//console.log(dataname);
		//for (var i in Object.keys(users))
		//{
			io.sockets.emit('usernames',Object.keys(users));
		//}
		//socket.broadcast.emit('usernames',Object.keys(users));
		//users[socket.nickname].emit('own_usernames',dataname,Object.keys(users));
	}

	socket.on('send message',function(data, callback){
		var msg = data.trim();
		if(msg.substr(0,1) === '@'){
			msg= msg.substr(1);
        		var ind = msg.indexOf(' ');

        		if(ind !== -1){
          			var name = msg.substring(0,ind);
          			var msg = msg. substring(ind+1);
          			if(name in users){
          				users[name].emit('whisper',{msg:msg, nick:socket.nickname});
          				users[socket.nickname].emit('own whisper',{msg:msg, nick:name});	
          				console.log('Whisper!');	
          				}
          			else{
          				callback('Enter a valid User');
          				}
				}
			else{
				callback('Please enter a message for your private message');
			}
		}
		else{
			//var newMsg = new Chat({msg:msg, nick:socket.nickname});
			//newMsg.save(function(err){
			//	if(err) throw err;
			//io.sockets.emit('new message',{msg:msg, nick:socket.nickname});
			socket.broadcast.emit('new message',{msg:msg, nick:socket.nickname});
			users[socket.nickname].emit('own message',{msg:msg, nick:socket.nickname});
			//});
		     }
		});

	socket.on('disconnect',function(data){
		if(!socket.nickname) return;
		delete users[socket.nickname];
		updateNicknames();
	});
});