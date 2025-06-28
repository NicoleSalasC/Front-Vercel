import React, { useEffect, useState } from 'react';

const VoiceCommand = ({ onVoiceCommand }) => {
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.continuous = false;

    const handleKeyDown = (e) => {
      if (e.altKey && e.code === 'KeyV') {
        setIsRecording(true);
        recognition.start();
      }
    };

    const handleKeyUp = (e) => {
      if (e.altKey && e.code === 'KeyV') {
        setIsRecording(false);
        recognition.stop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      if (onVoiceCommand) {
        onVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Error de reconocimiento de voz:", event.error);
      setIsRecording(false);
    };

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      recognition.abort();
    };
  }, [onVoiceCommand]);

  return (
    <div className="text-gray-600 text-sm">
      {isRecording ? (
        <div className="text-red-500 animate-pulse">
          🎤 Grabando... (suelta Alt + V para terminar)
        </div>
      ) : (
        <div>
          💬 Presiona <strong>Alt + V</strong> para registrar por voz
        </div>
      )}
    </div>
  );
};

export default VoiceCommand;
