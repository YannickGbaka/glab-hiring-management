'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RetellWebClient } from "retell-client-js-sdk";
import './WebCall.css';

interface Message {
  role: 'agent' | 'user';
  content: string;
  timestamp: number;
}

const WebCallPage = () => {
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [retellWebClient] = useState<RetellWebClient>(new RetellWebClient());
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Écouteurs existants
    retellWebClient.on("call_ended", () => {
      console.log("call ended");
      setIsCallActive(false);
      setCallId(null);
    });

    // Écouteur pour la transcription en temps réel
    retellWebClient.on("live-transcript", (transcript) => {
      console.log("Live transcript received:", transcript);
      const newMessage: Message = {
        role: transcript.type === 'agent' ? 'agent' : 'user',
        content: transcript.text || '',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newMessage]);
    });

    // Écouteur pour la transcription finale
    retellWebClient.on("transcript", (transcript) => {
      console.log("Final transcript received:", transcript);
      const newMessage: Message = {
        role: transcript.type === 'agent' ? 'agent' : 'user',
        content: transcript.text || '',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newMessage]);
    });

    // Écouteurs de débogage supplémentaires
    retellWebClient.on("error", (error) => {
      console.error("Retell error:", error);
      setError(`Erreur Retell: ${error.message}`);
    });

    retellWebClient.on("connected", () => {
      console.log("Retell connected successfully");
    });

    retellWebClient.on("connecting", () => {
      console.log("Retell connecting...");
    });

    retellWebClient.on("disconnected", () => {
      console.log("Retell disconnected");
    });

    retellWebClient.on("speaking", (speaking) => {
      console.log("Speaking status:", speaking);
    });

    // Nettoyage
    return () => {
      retellWebClient.removeAllListeners();
    };
  }, [retellWebClient]);

  const startCall = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Starting call - requesting backend...");
      const response = await axios.post('http://localhost:3001/api/webcall/create', {});
      console.log("Backend response:", response.data);

      if (response.data.success) {
        setCallId(response.data.callId);
        console.log("Initializing Retell SDK with token:", response.data.access_token);
        
        try {
          await retellWebClient.startCall({
            accessToken: response.data.access_token,
            sampleRate: 24000,
            captureDeviceId: "default",
          });
          console.log("Retell SDK initialized successfully");
          setIsCallActive(true);
          
          // Ajouter un message initial pour confirmer que le chat fonctionne
          setMessages([{
            role: 'agent',
            content: 'Appel démarré - En attente de la conversation...',
            timestamp: Date.now()
          }]);
          
        } catch (sdkError: any) {
          console.error("SDK initialization error:", sdkError);
          setError("Erreur lors de l'initialisation de l'appel: " + sdkError.message);
          setCallId(null);
        }
      } else {
        setError("Échec de la création de l'appel");
      }
    } catch (err: any) {
      console.error("Call creation error:", err);
      setError(err.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const endCall = async () => {
    if (!callId) return;

    try {
      setLoading(true);
      setError(null);

      // Stop the Retell SDK call
      try {
        await retellWebClient.stopCall();
        setIsCallActive(false);
        setCallId(null);
      } catch (sdkError: any) {
        console.error("Error stopping Retell call:", sdkError);
      }

    } catch (err: any) {
      setError(err.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="webcall-container">
      <h2>Appel avec le candidat</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="call-controls">
        {!isCallActive ? (
          <button 
            onClick={startCall} 
            disabled={loading}
            className="call-button start"
          >
            {loading ? "Démarrage..." : "Démarrer l'appel"}
          </button>
        ) : (
          <button 
            onClick={endCall} 
            disabled={loading}
            className="call-button end"
          >
            {loading ? "Terminaison..." : "Terminer l'appel"}
          </button>
        )}
      </div>

      {isCallActive && (
        <>
          <div className="call-status">
            Appel en cours...
            <div className="call-id">ID de l'appel: {callId}</div>
          </div>

          <div className="chat-container">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`chat-message ${message.role}`}
              >
                <div className={`message-header ${message.role}`}>
                  {message.role === 'agent' ? '🧑‍💼 Agent' : '👤 Candidat'}
                </div>
                <div className={`message-content ${message.role}`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WebCallPage; 