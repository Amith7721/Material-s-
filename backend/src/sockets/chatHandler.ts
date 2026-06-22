import { Server, Socket } from 'socket.io';

export default function setupSockets(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected to chat: ${socket.id}`);

    socket.on('ai_message', async (data) => {
      // Simulate thinking
      socket.emit('ai_typing', { status: true });

      // Here you would connect to OpenAI / LangChain / Python ML microservice via streaming
      setTimeout(() => {
        socket.emit('ai_typing', { status: false });
        socket.emit('ai_response', {
          id: Date.now().toString(),
          message: `I received your query about "${data.message}". I am processing it through the ML microservice.`
        });
      }, 2000);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
