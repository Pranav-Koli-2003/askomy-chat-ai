
import React, { useEffect, useRef, useState } from 'react';
import {
  AskOmy_Ai_chat,
  AskOmy_chat_history
} from '../api/api_link';
import { saveToken } from '../api/token';
import './Ai_chat.css';

function Ai_chat({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const MAX_PROMPT_CHARACTERS = 8000;

  const bottomRef = useRef(null);
  const requestRef = useRef(0);

  // Automatically scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load the selected chat's history
  useEffect(() => {
    const requestId = ++requestRef.current;

    setMessages([]);
    setError('');
    setLoading(false);

    if (!chatId) return;

    async function loadHistory() {
      try {
        const result = await AskOmy_chat_history({
          chat_title_id: chatId
        });

        if (requestId !== requestRef.current) return;

        if (result?.value === 'False') {
          setError(result.message || 'Could not load chat history.');
          return;
        }

        const rows = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.history)
              ? result.history
              : [];

        setMessages(
          rows.flatMap((item, index) => {
            const userText = item.user_chat_prompt;
            const aiText = item.askomy_chat_response;

            return [
              ...(userText ? [{
                id: `user-${item.id ?? index}`,
                role: 'user',
                text: userText
              }] : []),
              ...(aiText ? [{
                id: `ai-${item.id ?? index}`,
                role: 'assistant',
                text: aiText
              }] : [])
            ];
          })
        );
      } catch (err) {
        console.error('History error:', err);
        if (requestId === requestRef.current) {
          setError('History failed to load. Check the Django API.');
        }
      }
    }

    loadHistory();

    return () => {
      requestRef.current++;
    };
  }, [chatId]);

  // Show the AI answer gradually
  async function streamText(messageId, fullText, requestId) {
    const words = fullText.split(/(\s+)/);
    let currentText = '';

    for (const word of words) {
      if (requestId !== requestRef.current) return;

      currentText += word;

      setMessages(previous =>
        previous.map(message =>
          message.id === messageId
            ? { ...message, text: currentText }
            : message
        )
      );

      await new Promise(resolve => setTimeout(resolve, 18));
    }
  }

  // Send prompt to Django
  
async function askomyResponse(e) {
  e.preventDefault();

  const text = userPrompt.trim();

  if (!text || loading) return;

  // Free Gemini models have input limits. Catch very long prompts before calling Django.
  if (text.length > MAX_PROMPT_CHARACTERS) {
    setError('This prompt is too long. AI is not responding. Please shorten your prompt and try again.');
    return;
  }

  if (!chatId) {
    setError('Chat ID is missing. Create or select a chat first.');
    console.error('Missing chatId:', chatId);
    return;
  }

  setError('');
  setLoading(true);

  const currentChatId = chatId;
  const userMessageId = `user-${Date.now()}`;
  const aiMessageId = `ai-${Date.now()}`;

  // Display the prompt immediately
  setMessages(previous => [
    ...previous,
    { id: userMessageId, role: 'user', text },
    { id: aiMessageId, role: 'assistant', text: '', streaming: true }
  ]);

  setUserPrompt('');

  try {
    const data = {
      chat_title_id: currentChatId,
      user_prompt: text
    };

    console.log('Sending API request:', data);

    const result = await AskOmy_Ai_chat(data);

    console.log('Django API response:', result);

    if (!result || typeof result !== 'object') {
      throw new Error('Django returned an invalid response.');
    }

    if (result.jwt_tokens) {
      saveToken(result.jwt_tokens);
    }

    const answer =
      result.askomy ??
      result.askomy_chat_response ??
      result.response;

    if (typeof answer !== 'string' || !answer.trim()) {
      throw new Error(
        result.message || 'No AI answer found in the API response. Check the console.'
      );
    }

    await streamText(aiMessageId, answer, requestRef.current);

    setMessages(previous =>
      previous.map(message =>
        message.id === aiMessageId
          ? { ...message, streaming: false }
          : message
      )
    );

  } catch (err) {
    console.error('Send prompt failed:', err);
    const friendlyMessage = /too long|token limit|maximum.*token|input.*too long|413/i.test(err.message || '')
      ? 'This prompt is too long. AI is not responding. Please shorten your prompt and try again.'
      : (err.message || 'Failed to send prompt to Django.');
    setError(friendlyMessage);
    setMessages(previous => previous.filter(message => message.id !== aiMessageId));
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="ai-chat">

      <main className="ai-messages">
        {!chatId ? (
          <div className="ai-welcome">
            <div className="welcome-logo">✦</div>
            <h1>What can I help with?</h1>
            <p>Create a new chat or select one from your history.</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="ai-welcome">
            <div className="welcome-logo">✦</div>
            <h1>Let's start a conversation</h1>
            <p>Ask a question and explore something new.</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              className={`message-row ${message.role}`}
              key={message.id}
            >
              {message.role === 'assistant' && (
                <div className="message-avatar">✦</div>
              )}

              <div className="message-content">
                <div className="message-name">
                  {message.role === 'user' ? 'You' : 'AskOmy AI'}
                </div>

                <div className={`message-text ${message.role}`}>
                  {message.text}
                  {message.streaming && (
                    <span className="stream-cursor" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {error && <div className="ai-error">{error}</div>}

        <div ref={bottomRef} />
      </main>

      <form className="ai-input-area" onSubmit={askomyResponse}>
        <div className="ai-input-box">
          <textarea
            rows="1"
            placeholder={chatId ? 'Message AskOmy AI...' : 'Select or create a chat first'}
            value={userPrompt}
            disabled={!chatId || loading}
            onChange={e => setUserPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form.requestSubmit();
              }
            }}
          />

          <button
            type="submit"
            className="ai-send-button"
            disabled={!chatId || loading || !userPrompt.trim()}
            aria-label="Send message"
          >
            {loading ? '၊၊||၊' : '.✦ ݁˖'}
          </button>
        </div>

        <p className="ai-disclaimer">
          AskOmy AI can make mistakes. Verify important information.
        </p>
      </form>
    </div>
  );
}

export default Ai_chat;
