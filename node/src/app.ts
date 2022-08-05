import 'dotenv/config';
import express, { Request, Response } from 'express';
import { router } from './routes';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use(router);

export { io, httpServer };
