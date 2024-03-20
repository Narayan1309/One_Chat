const form = $('.message-form')
const socket = io();

let { username } = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

if(username === ''){
    window.location.replace('/')
}

socket.emit('joinChannel',username)

socket.on('message', message => {
    outputMessage(message.username,message.content,message.time)
    let element = document.querySelector('.messages');
    element.scrollTop = element.scrollHeight
})

socket.on('updateUsers', users => {
    $('.users').empty();
    document.querySelector('.users').innerHTML += '<h3 class="user-title">USERS:</h3>'
    for(i in users){
        document.querySelector('.users').innerHTML += `<h4 class="user">${users[i]}</h4>`
    } 
})

form.on('submit', (event) => {
    event.preventDefault();
    const message = {
        content: document.querySelector('input').value,
    }
    if(!(message.content === '')){
        socket.emit('chatmessage',message)
    }
    document.querySelector('input').value = "";
    document.querySelector('input').focus();
})

const outputMessage = (senderusername,message,time) => {
    document.querySelector('.messages').innerHTML += `<div class="message">
                                                        <h2>${senderusername} (${time})</h2>
                                                        <p>${message}</p>
                                                        </div>`;
    
}
