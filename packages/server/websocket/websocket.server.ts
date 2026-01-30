import { Server as HttpServer, IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { WebSocket, WebSocketServer } from 'ws';

import type { Client, GameState, Message } from '../models/message.model';

export class WebSocketServerManager {
  private wss: WebSocketServer;
  private clients: Map<string, Client>;
  private gameState: GameState; // Храним состояние игры

  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map();
    this.gameState = { score: 1 };

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const clientId = uuidv4();
      const userAgent = req.headers['user-agent'] || 'Unknown';
      console.log(
        `клиент подключился с ID: ${clientId}, User-Agent: ${userAgent}`,
      );

      const client: Client = { id: clientId, ws, userAgent };
      this.clients.set(clientId, client);

      // Отправка текущего состояния игры при подключении
      const welcomeMessage = {
        type: 'game-state',
        gameState: this.gameState,
      };
      ws.send(JSON.stringify(welcomeMessage));

      ws.on('message', (rawMessage: string) => {
        const users = Array.from(this.clients.values());
        if (users.length >= 1) {
          console.log('ID первого пользователя:', users[0].id);
        }
        if (users.length >= 2) {
          console.log('ID второго пользователя:', users[1].id);
        }
        const message: Message = JSON.parse(rawMessage);

        if (message.type === 'chat') {
          // Рассылка сообщения чата всем клиентам
          const chatMessage = {
            ...message,
            senderId: clientId,
            userAgent,
          };
          this.broadcast(chatMessage);
        } else if (message.type === 'game-state' && message.gameState) {
          // Обновление состояния игры
          this.gameState = message.gameState;

          // Рассылка нового состояния игры всем клиентам
          const gameStateMessage: Message = {
            type: 'game-state',
            gameState: this.gameState,
          };
          this.broadcast(gameStateMessage);
        }
      });

      ws.on('close', () => {
        console.log(`Клиент с ID ${clientId} отключился`);
        this.clients.delete(clientId);
      });
    });
  }

  broadcast(message: Message): void {
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }
}
