
const micContainer = document.getElementById('micContainer');
const responseContainer = document.getElementById('responseContainer');

let isMicActive = false;

let recognition;

micContainer.addEventListener('click', toggleMic);

// Function to toggle microphone activity
function toggleMic() {
  if (!isMicActive) {
    startSpeechRecognition();
    micContainer.classList.add('active');
  } else {
    stopSpeechRecognition();
    micContainer.classList.remove('active');
  }
  isMicActive = !isMicActive;
}

function startSpeechRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.start();

  recognition.onresult = function (event) {
    const speechResult = event.results[event.results.length - 1][0].transcript;
    console.log('Speech:', speechResult);

    displaySpeechInput(speechResult);

    // Send speech to the backend
    fetch('/process-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speech: speechResult })
    })
      .then(response => response.json())
      .then(data => {
        const chatGPTResponse = data.response;
        console.log('ChatGPT:', chatGPTResponse);
        displayResponse(chatGPTResponse);
      })
      .catch(error => {
        console.error('Error:', error);
        displayResponse('An error occurred.');
      });
  };
}

function stopSpeechRecognition() {
  if (recognition) {
    recognition.stop();
  }
}

function displaySpeechInput(speech) {
  responseContainer.innerHTML = `<p>You: ${speech}</p>`;
}

function displayResponse(response) {
  const chatGPTResponse = `<p>ChatGPT: ${response}</p>`;
  responseContainer.innerHTML += chatGPTResponse;
}
