import React, { useEffect, useState } from 'react';

import type { GameState, Message } from 'server/models/message.model.ts';

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>({ score: 1 });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);

      if (message.type === 'chat') {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else if (message.type === 'game-state' && message.gameState) {
        setGameState(message.gameState); // Обновляем состояние игры
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: Message = {
        type: 'chat',
        message: inputValue,
      };
      ws.send(JSON.stringify(message));
      setInputValue('');
    } else {
      console.error('WebSocket не готов');
    }
  };

  const updateGameState = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const newState = { score: Math.floor(Math.random() * 100) }; // Пример состояния игры
      const message: Message = {
        type: 'game-state',
        gameState: newState,
      };
      ws.send(JSON.stringify(message));
    }
  };

  return (
    <div>
      <h1>Чат</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.senderId ? `[${msg.senderId.slice(0, 5)}] ` : ''}
            {msg.message}
          </li>
        ))}
      </ul>
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={sendMessage}>Отправить</button>

      <h2>Состояние игры</h2>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
      <button onClick={updateGameState}>Обновить состояние игры</button>
    </div>
  );
};
