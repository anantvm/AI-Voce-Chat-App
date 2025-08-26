import { useState, useRef } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [geminiResponse, setGeminiResponse] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const getMessageBoxClass = (type) => {
    if (type === 'success') {
      return 'bg-green-200 text-green-800';
    } else if (type === 'error') {
      return 'bg-red-200 text-red-800';
    } else if (type === 'info') {
      return 'bg-blue-200 text-blue-800';
    }
    return '';
  };

  const startRecording = async () => {
    try {
      // Clear previous results
      setTranscription('');
      setGeminiResponse('');
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Event listener for when data is available
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });

      // Event listener for when recording stops
      mediaRecorderRef.current.addEventListener('stop', async () => {
        setIsLoading(true);
        showMessage('Recording stopped. Sending to server...', 'info');

        try {
          // Create a Blob from the audio chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          // Read the blob as a base64 string
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64data = reader.result.split(',')[1];
            
            // Step 1: Send the audio to the backend for transcription
            const transcribeResponse = await fetch('http://localhost:3000/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioData: base64data }),
            });

            if (!transcribeResponse.ok) {
              const errorText = await transcribeResponse.text();
              throw new Error(`Transcription API call failed: ${errorText}`);
            }

            const transcribeData = await transcribeResponse.json();
            const transcribedText = transcribeData.transcription;
            setTranscription(transcribedText);
            showMessage('Transcription successful! Sending to Gemini...', 'success');

            // Step 2: Send the transcribed text to the backend for Gemini's response
            const geminiResponse = await fetch('http://localhost:3000/api/gemini', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: transcribedText }),
            });

            if (!geminiResponse.ok) {
              const errorText = await geminiResponse.text();
              throw new Error(`Gemini API call failed: ${errorText}`);
            }

            const geminiData = await geminiResponse.json();
            const geminiReply = geminiData.response;
            setGeminiResponse(geminiReply);
            showMessage('Gemini response received!', 'success');
          };
        } catch (error) {
          console.error('Error:', error);
          showMessage(`An error occurred: ${error.message}`, 'error');
        } finally {
          setIsLoading(false);
        }
      });
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsLoading(true);
      showMessage('Recording started. Speak now...', 'info');

      // Stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 5000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      showMessage(`Error: Microphone access denied. Please allow microphone permissions.`, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Voice Chat</h1>
        <p className="text-gray-600 mb-8">
          Click the button below and speak for 5 seconds to start a conversation with the AI.
        </p>

        {message.text && (
          <div className={`p-3 rounded-lg text-sm text-center mb-4 transition-all duration-300 ${getMessageBoxClass(message.type)}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={startRecording}
          disabled={isLoading}
          className={`font-semibold py-3 px-6 rounded-full shadow-md transition-colors duration-200 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Listening...' : 'Start Conversation'}
        </button>

        <div className="mt-8 text-left">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Results:</h2>
          {transcription && (
            <div className="bg-gray-200 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-800">Transcription:</h3>
              <p className="text-gray-700 mt-1">{transcription}</p>
            </div>
          )}
          {geminiResponse && (
            <div className="bg-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">Gemini's Response:</h3>
              <p className="text-gray-700 mt-1">{geminiResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
