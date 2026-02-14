const WebSocket = require('ws');

// Render จะส่ง Port มาให้ทาง Environment Variable ถ้าไม่มีให้ใช้ 8080
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: port });

console.log(`Server started on port ${port}`);

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    // หลักการ Relay: ได้รับอะไรมา (จาก ESP32) ให้ส่งต่อให้คนอื่นหมด (หน้าเว็บ)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});