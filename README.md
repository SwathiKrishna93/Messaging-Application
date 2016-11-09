#Messaging Application

Platform and Libraries

We have used Node.js platform to build our application
Socket.io library of javascript was used since it enables bi-directional
communication between web clients and servers.
Express.js framework was employed in building the application.

Login

We maintain a users list to keep track of the people logged in.
Every new user who logs in, needs to provide a username which has to be
unique.
If the username is already taken, the application asks the user to log in with a
different username.
If the user enters a unique username, he/she will be able to see his/her chat
window.

Chat Rooms - Join and Leave

We have created 5 chat rooms.
An user can join any chat room of his choice at any time.
When a user logs in for the first time, he/she gets added to Room 1 by default.
An user can leave a room and join another room by clicking on the name of
the room he/she wants to join.
If a user wants to leave the chat application at any time, he/she can just close
the tab and he/she gets logged out automatically.

On Refreshing the page, a prompt comes asking whether the user wants to reload warning he/she would be logged out if he/she chooses to reload.

Messaging

We have employed two types of messaging, public and private.
A public message that a person sends, will be visible to all the users logged in
in the same chatroom
A user can send private messages to any other user in the same chat room by
prefix the messaging with @username , i.e the message would be @username
message
If the user tries to send a private message to a non-existent user or an user
who is not in the same chat-room as him, there would be an error message.

Messaging - display

The messages sent by an user to the chat room come on right side of his chat
window (in lavender background) and left side of the chat windows of the
other users in his chat room (in light-blue background)
The messages sent by the user to another user in private is shown on the right
side of the chat window of the person who sent (in light-green background) and on left
side of the chat window of the person who received (in pink background)
