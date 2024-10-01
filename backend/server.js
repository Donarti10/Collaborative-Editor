const WebSocket = require('ws');
const Y = require('yjs');
const { setupWSConnection } = require('y-websocket/bin/utils');

const yDoc = new Y.Doc();

const wss = new WebSocket.Server({ port: 3001 });
let userCount = 0;

wss.on('connection', (ws) => {
  userCount++;
  const userId = `user-${userCount}`;
  console.log(`Client connected: ${userId}`);

  // Send a unique user ID to the connected client
  ws.send(JSON.stringify({ type: 'ASSIGN_USER', userId }));

  ws.on('message', (message) => {
    try {
      let messageStr;
      if (message instanceof Buffer) {
        // Convert the message from Buffer to string format
        messageStr = message.toString('utf-8');
      } else {
        messageStr = message.toString();
      }

      if (!messageStr.trim()) {
        throw new Error('Empty or invalid message received');
      }

      // Parse the JSON message received from the client
      const data = JSON.parse(messageStr); 
      console.log(`Received from ${data.userId}: ${JSON.stringify(data.content)}`);

      // Broadcast the received content to all other connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'CONTENT_UPDATE',
            userId: data.userId,
            content: data.content,
          }));
        }
      });
    } catch (error) {
      console.error('Failed to process message:', error.message);
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${userId}`);
  });
});

console.log('WebSocket server running on ws://localhost:3001');
