// reconstructed_messenger/server/index.ts
import { WebSocketServer, WebSocket } from 'ws';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8085;
const wss = new WebSocketServer({ port: PORT });

interface ClientSession {
  id: string;
  ws: WebSocket;
  lastState?: any;
  lastPing: number;
}

const clients = new Map<WebSocket, ClientSession>();

console.log(`[Messenger Server] Authoritative WebSocket server listening on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  const session: ClientSession = {
    id: `peer_${Math.floor(Math.random() * 100000)}`,
    ws,
    lastPing: Date.now(),
  };
  clients.set(ws, session);

  console.log(`[Messenger Server] Peer connected: ${session.id} (Total: ${clients.size})`);

  ws.on('message', (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'HANDSHAKE') {
        session.id = data.id || session.id;
        ws.send(JSON.stringify({ type: 'WELCOME', id: session.id, totalPeers: clients.size }));
        return;
      }

      if (data.type === 'STATE_DELTA') {
        session.lastState = data;

        // Broadcast to all other peers in room
        const payload = JSON.stringify(data);
        for (const [peerWs, peerSession] of clients.entries()) {
          if (peerWs !== ws && peerWs.readyState === WebSocket.OPEN) {
            peerWs.send(payload);
          }
        }
      }
    } catch (e) {
      // Ignore invalid packet
    }
  });

  ws.on('close', () => {
    console.log(`[Messenger Server] Peer disconnected: ${session.id}`);
    clients.delete(ws);

    // Broadcast departure
    const disconnectPacket = JSON.stringify({
      type: 'PEER_DISCONNECTED',
      id: session.id,
    });

    for (const [peerWs] of clients.entries()) {
      if (peerWs.readyState === WebSocket.OPEN) {
        peerWs.send(disconnectPacket);
      }
    }
  });
});
