import Jimp from "jimp";
import { httpServer } from "./http_server/index";
import robot from "robotjs";
import { wss } from "./ws_server/index";
import { drawCircle } from "./drawCircle";
import { capturePrntScrn } from "./capturePrntScrn";
import { drawRectangle } from "./drawRectangle";

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

wss.on("connection", (ws: any) => {
  ws.on("message", async (message: any) => {
    const [command, argv1, argv2] = message.toString().split(" ");
    console.log(command);

    let { x, y } = robot.getMousePos();

    if (command === "mouse_left") {
      robot.moveMouse(x - Number(argv1), y);
    }
    if (command === "mouse_down") {
      robot.moveMouse(x, y + Number(argv1));
    }
    if (command === "mouse_right") {
      robot.moveMouse(x + Number(argv1), y);
    }
    if (command === "mouse_up") {
      robot.moveMouse(x, y - Number(argv1));
    }

    if (command === "draw_circle") {
      drawCircle(argv1);
    }

    if (command === "draw_square") {
      drawRectangle(argv1);
    }

    if (command === "draw_rectangle") {
      drawRectangle(argv1, argv2);
    }

    if (command === "mouse_position") {
      ws.send(`mouse_position ${x},${y}`);
    }

    if (command === "prnt_scrn") {
      const result = capturePrntScrn({ x, y, h: 200, w: 200 });
      const img_base = (await result.getBase64Async(Jimp.MIME_PNG)).split(
        ","
      )[1];
      console.log(img_base);
      !ws.send(`prnt_scrn ${img_base}`);
    }
  });
});

wss.on("close", () => {
  console.log("socket closed");
});
