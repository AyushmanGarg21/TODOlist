document.getElementById('newlist').addEventListener('click', function() {
    const userInput = prompt('Enter your list name:');
    
    if (userInput !== null && userInput.trim() !== '') {
        const currentHost = window.location.hostname;
        const currentPort = window.location.port;
        const serverURL = `http://${currentHost}:${currentPort}/${userInput}`;
        fetch(serverURL)
          .then(response => {
            window.location.href = response.url;
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }
});