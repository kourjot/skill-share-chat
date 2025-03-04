const socket = io();

const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('login-button');
const userList = document.getElementById('user-list');
const messageList = document.getElementById('message-list');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');

let username;

loginButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        socket.emit('login', username);
    
        loginContainer.style.display = 'none';
        chatContainer.style.display = 'block';
    }
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('send-message', message);
        messageInput.value = '';
    }
});

messageInput.addEventListener('input', () => {
    const status = messageInput.value.trim() ? true : false;
    socket.emit('typing', status);
});

socket.on('receive-message', ({ username, message }) => {
    const li = document.createElement('li');
    li.textContent = `${username}: ${message}`;
    messageList.appendChild(li);
});

socket.on('update-users', (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
});

socket.on('typing', ({ username, status }) => {
    typingIndicator.textContent = status ? `${username} is typing...` : '';
});
