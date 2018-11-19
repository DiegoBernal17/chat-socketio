const socket = io();

// DOM elements
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let error = document.getElementById('error');
let online = document.getElementById('online');

btn.addEventListener('click', function() {
    if( username.value === '') { 
        error.className = '';
        error.innerHTML = 'Empty Username';
    } else if( message.value === '') {
        error.className = '';
        error.innerHTML = 'Empty Message';
    } else {
        socket.emit('chat:message', {
            username: username.value,
            message: message.value
        });
        message.value = '';
    }
});

message.addEventListener('keypress', function(e) {
    socket.emit('chat:typing', username.value)
});

socket.on('chat:message', function(data) {
    error.classList.add('d-none');
    actions.innerHTML = '';
    output.innerHTML += 
    `<p>
        <strong>${data.username}</strong>: ${data.message}
    </p>`

    output.scrollTo(0, output.scrollHeight);
});

socket.on('chat:typing', function(data) {
    if(data === '') {
        actions.innerHTML = '';
    }
    actions.innerHTML = `<p><em>${data} is typing a message`;
});

socket.on('chat:online', function(data) {
    online.innerHTML = data;
});