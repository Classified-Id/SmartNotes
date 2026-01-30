import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import * as path from 'path';
import metricsRoutes from './routes/metrics.routes';
import { WebSocketServerManager } from './websocket/websocket.server';

dotenv.config({ path: path.resolve(__dirname, '.env.development') });

const app = express();
const PORT = process.env.PORT || 3000;
console.log('1', process.env.PORT);

app.use(cors());
app.use(express.json());

// Routes
app.use('/', metricsRoutes);

// Start HTTP server
const httpServer = app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

new WebSocketServerManager(httpServer);
