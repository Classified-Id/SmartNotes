import { WebSocket } from 'ws';

export interface GameState {
  score: number;
}

export interface Message {
  type: 'chat' | 'game-state'; // Тип сообщения
  message?: string; // Текст сообщения (для чата)
  gameState?: GameState; // Данные состояния игры (для синхронизации)
  senderId?: string; // ID отправителя
  userAgent?: string; // Информация о браузере
}

export interface Client {
  id: string;
  ws: WebSocket;
  userAgent: string;
}
