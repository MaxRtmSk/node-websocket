import ws from "ws";

const wsServer = new WebSocket.Server({ port: 9000 });

wsServer.on("connection", onConnect);
