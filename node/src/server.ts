import { httpServer, io } from './app';

io.on('connection', (socket) =>
  console.log(`Usuário conectado no socket ${socket.id}`),
);

httpServer.listen(process.env.PORT || 3333, () =>
  console.log(`Server is running in port - ${process.env.PORT}`),
);
