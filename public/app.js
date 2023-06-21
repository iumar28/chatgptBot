// Get DOM elements
const micContainer = document.getElementById('micContainer');
const responseContainer = document.getElementById('responseContainer');

// Boolean flag to track if microphone is active
let isMicActive = false;

// Declare the recognition variable in the outer scope
let recognition;

// Event listener for the mic container
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

// Function to start speech recognition
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

// Function to stop speech recognition
function stopSpeechRecognition() {
  if (recognition) {
    recognition.stop();
  }
}

// Function to display the speech input
function displaySpeechInput(speech) {
  responseContainer.innerHTML = `<p>You: ${speech}</p>`;
}

// Function to display the response from ChatGPT
function displayResponse(response) {
  const chatGPTResponse = `<p>ChatGPT: ${response}</p>`;
  responseContainer.innerHTML += chatGPTResponse;
}
