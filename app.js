var express = require('express');
var app= express();
var server = require('http').createServer(app);
var io= require('socket.io').listen(server);
//var mongoose = require('mongoose');
var users={};
//var fs = require('fs');
server.listen(3000);

var rooms=['Room 1','Room 2','Room 3','Room 4', 'Room 5'];
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
var roomusers;
// = [[],[],[],[],[]];

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
		if (data in users || data=='SERVER' || data =='') {
			callback(false);
			}
		else{
			callback(true);
			socket.nickname = data;
			socket.room ='Room 1';
			users[socket.nickname]=socket;
			socket.join('Room 1');
			socket.emit('new message',{nick:'SERVER',msg:'You have connected to Room 1'});
			socket.broadcast.to(socket.room).emit('new message',{nick:'SERVER',msg: data+' has connected to Room 1'});
			socket.emit('updaterooms',rooms,'Room 1');
			io.sockets.emit('usernames',Object.keys(users));
			console.log(users[socket.nickname]);
			updateNicknames();
			updateUsers();
			//roomusers[0].push(socket.nickname)

			}
	});
	// function addImage(){
	// 	fs.readFile(__dirname + '/images/image.jpg', function(err, buf){
 //    // it's possible to embed binary data
 //    // within arbitrarily-complex objects
 //    	socket.emit('image', { image: true, buffer: buf});
 //    			console.log('image file is initialized');
 // 	 });
	// }
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
          			if(name in users && users[name].room == socket.room ){
          				if (name == socket.nickname)
          					{
          						users[name].emit('whisper',{msg:msg, nick:'ME'});
          					}
          				else
          				{	
          					users[name].emit('whisper',{msg:msg, nick:socket.nickname});
          					users[socket.nickname].emit('own whisper',{msg:msg, nick:'To '+name});
          				}
          					
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
			if (msg == '')
				callback('Empty message!');
			else{
				socket.broadcast.to(socket.room).emit('new message',{msg:msg, nick:socket.nickname});
				users[socket.nickname].emit('own message',{msg:msg, nick:socket.nickname});
			}
			//io.sockets.in(socket.room).emit('new message', {nick:socket.nickname, msg:msg});

			//});for(var i = 0; i < clients.length; i++) {

		     }
		});
	function updateUsers()
	{
		var roomusers = [[],[],[],[],[]];

		for( var roo in rooms)
		    	{	
		    		console.log(roo);
		    		console.log(rooms[roo]);
		    		//var clients_no = io.sockets.clients[rooms[roo]]);
				var client_no = io.sockets.adapter.rooms[rooms[roo]];
				var clients = (typeof client_no !== 'undefined') ? io.sockets.adapter.rooms[rooms[roo]].sockets : [];
				//var client_no = io.sockets.adapter.rooms[rooms[roo]].sockets;
		    		console.log(clients);
		    		for (var clientId in clients) 
		    		{

  					console.log('client: %s', clientId); //Seeing is believing 
  					var client_socket = io.sockets.connected[clientId];
  					console.log(client_socket.nickname);
  					if (roomusers[roo].indexOf(client_socket.nickname) < 0)
		    				roomusers[roo].push(client_socket.nickname);
				}
				console.log(roomusers);
				io.sockets.to(rooms[roo]).emit('updateroomusers',roomusers[roo]);
			}
	}
	socket.on('switchRoom', function(newroom){
		    // leave the current room (stored in session)
		    console.log("Here");
		    socket.leave(socket.room);
		    // join new room, received as function parameter
		    socket.join(newroom);
		    console.log("Here");
		    var msg1 = 'You have connected to '+ newroom ;
		    console.log(msg1);
		    socket.emit('new message', {msg:msg1, nick:'SERVER'});
		    // sent message to OLD room
		    msg1 = socket.nickname +' has left this room';
		    socket.broadcast.to(socket.room).emit('new message', { msg: msg1, nick:'SERVER'});
		    // update socket session room title
		    socket.room = newroom;
		    msg1 = socket.nickname +' has joined this room';
		    socket.broadcast.to(newroom).emit('new message', {msg:msg1, nick:'SERVER'});
		    socket.emit('updaterooms', rooms, newroom);
		    updateUsers();
		    
		
  	});

	
	socket.on('disconnect',function(data){
		if(!socket.nickname) return;
		delete users[socket.nickname];
		updateNicknames();
		socket.broadcast.emit('new message', {nick:'SERVER',msg:socket.nickname + ' has disconnected'});
    		socket.leave(socket.room);
    		updateUsers();
	});
});
