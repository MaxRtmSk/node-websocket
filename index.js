import Jimp from "jimp";
import { httpServer } from "./src/http_server/index.js";
import robot from "robotjs";
import { WebSocketServer } from "ws";
import { drawCircle } from "./src/drawCircle.js";

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const [event, argv] = message.toString().split(" ");
    console.log(event);
    // console.log("received: %s", data);

    let { x, y } = robot.getMousePos();

    if (event === "mouse_left") {
      robot.moveMouse(x - Number(argv), y);
    }
    if (event === "mouse_down") {
      robot.moveMouse(x, y + Number(argv));
    }
    if (event === "mouse_right") {
      robot.moveMouse(x + Number(argv), y);
    }
    if (event === "mouse_up") {
      robot.moveMouse(x, y - Number(argv));
    }

    if (event === "draw_circle") {
      drawCircle(argv);
    }

    if (event === "mouse_position") {
      ws.send(`mouse_position ${x},${y}`);
    }
  });

  //   ws.send("something");
});

wss.on("close", () => {});
