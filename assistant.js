// Add this to your script section
async function connectToGemini(message) {
    try {
        const response = await fetch('YOUR_GEMINI_API_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({
                prompt: message
            })
        });
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}

// Modify the sendMessage function
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'assistant-message', 'typing');
        typingIndicator.textContent = '...';
        chatMessages.appendChild(typingIndicator);
        
        // Get response from Gemini
        const response = await connectToGemini(message);
        
        // Remove typing indicator and add response
        typingIndicator.remove();
        addMessage(response, 'assistant');
    }
}
