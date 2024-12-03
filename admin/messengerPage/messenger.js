document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('http://localhost:3000/Message');
        if (response.ok) {
            const messages = await response.json();
            const chatWindow = document.querySelector(".convo")

            // Log the fetched messages to inspect the structure
            console.log('Fetched messages:', messages);

            messages.forEach((msg) => {
                console.log('Message object:', msg);
            
                // Loop through each convo for the user and admin messages
                msg.convo.forEach((conversation) => {
                    
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message');
            
                    // Check if the message is from the user
                    if (conversation.userMessage) {
                        messageElement.innerHTML = `${conversation.userMessage}`;
                        messageElement.classList.add('message'); 
                    } else {
                        messageElement.innerHTML = `${conversation.adminReply}`;
                        messageElement.classList.add('reply');
                    }
            
                    chatWindow.appendChild(messageElement);
                    chatWindow.scrollTop = chatWindow.scrollHeight;
                });
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }

    const sendMessage = document.getElementById("send");
    const messageInput = document.querySelector('.message-input');
    const messageList = document.querySelector('.message');
    
    // Simulating a user ID and Admin for simplicity
    let userId = 1;

    sendMessage.addEventListener('click', function () {
        const adminresponse = messageInput.value.trim();

        if (adminresponse) {

            // Add the message to the JSON structure
            let convo = {
                "userMessage": '',
                "adminReply": adminresponse
            };

            // Prepare the data to send to the server
            let messageData = {
                "id": userId,
                "user": `User${userId}`,
                "convo": [convo]
            };
            // Send the message data to the JSON server using fetch
            sendToServer(messageData);
        }
    });

    // Function to send message data to the server
    async function sendToServer(messageData) {
        try {
            const response = await fetch('http://localhost:3000/Message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            });

            if (response.ok) {
                const data = await response.json();
                getConvo(data);
                console.log('Message successfully sent to the server.');
            } else {
                console.error('Error sending message to server.');
            }
        } catch (error) {
            console.error('Error sending message to server:', error);
        }
    }
});