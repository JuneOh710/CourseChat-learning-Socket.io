const chatForm = document.getElementById('chat-form')
const socket = io()

// catch the 'message' from the server
socket.on('message', message => {
    displayMessage(message)
})
// catch the sidebar updates
socket.on('sidebarUpdate', users => {
    updateSidebar(users)
})

const chatMessages = document.querySelector('.chat-messages')
// send to sever that this user joined this room 
// a bit janky but I can send the username as the message. 
// (username is defined as a global variable in the ejs file as defined in the query.)
socket.on('connect', () => {
    socket.emit('joinRoom', { username, room })
})

// listen to chat form submission
chatForm.addEventListener('submit', event => {
    // prevent form from submitting
    event.preventDefault()
    // where event.target.elements.msg.value is the actual text
    socket.emit('chatMessage', { username, text: event.target.elements.msg.value })
    clearAndRefocus(event.target.elements.msg)
})



function displayMessage(message) {
    const chatMessages = document.querySelector('.chat-messages')
    const newChatMessage = document.createElement('div')
    newChatMessage.classList.add('message')
    if (message.username === username) {
        newChatMessage.classList.add('own-message')
    }
    if (message.username === '[Bot]') {
        newChatMessage.classList.add('bot-message')
        newChatMessage.innerHTML = `
                    <p class="text">
                        ${message.text}
                    </p>
                    `
    }
    else {
        newChatMessage.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
                        <p class="text">
                            ${message.text}
                        </p>
                        `
    }
    chatMessages.appendChild(newChatMessage)
    scrollToBottom(chatMessages)
}

function scrollToBottom(chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight
}
function clearAndRefocus(field) {
    field.value = '';
    field.focus()
}

function updateSidebar(users) {
    const sidebar = document.getElementById('users')
    const newUsers = document.createElement('div')
    sidebar.innerHTML = '';
    let newUsersHTML = ''
    for (let user of users) {
        newUsersHTML += `<li>${user.username}</li>`
    }
    newUsers.innerHTML = newUsersHTML;
    sidebar.appendChild(newUsers)
}