import Jimp from "jimp";
import { httpServer } from "./src/http_server/index.js";
import robot from "robotjs";
import { WebSocketServer } from "ws";
import { drawCircle } from "./src/drawCircle.js";
import { drawSquare } from "./src/drawSquare.js";
import { capturePrntScrn } from "./src/capturePrntScrn.js";

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({
  port: 8080,
});

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    const [event, argv] = message.toString().split(" ");
    console.log(event, argv);
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

    if (event === "draw_square") {
      drawSquare(argv);
    }

    if (event === "mouse_position") {
      ws.send(`mouse_position ${x},${y}`);
    }

    if (event === "prnt_scrn") {
      const result = capturePrntScrn({ x, y, h: 200, w: 200 });
      const img_base = (await result.getBase64Async(Jimp.AUTO)).split(",")[1];
      ws.send(`prnt_scrn ${img_base}`);
    }
  });
});

wss.on("close", () => {});
