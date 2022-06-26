import { createWebSocketStream } from "ws";
import robot from "robotjs";

import { httpServer } from "./http_server/index";
import { wss } from "./ws_server/index";

import { drawCircle } from "./drawCircle";
import { capturePrntScrn } from "./capturePrntScrn";
import { drawRectangle } from "./drawRectangle";

import type { WebSocket } from "ws";
import internal, { pipeline, Transform } from "stream";

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

class MyTransform extends Transform {
  constructor(options: any) {
    super(options);
  }

  override async _transform(
    chunk: any,
    _: BufferEncoding,
    callback: internal.TransformCallback
  ): Promise<void> {
    try {
      const [command, argv1, argv2] = chunk.toString().split(" ");
      let res: string = command;
      console.log(`${command} Start, parametrs: ${argv1} ${argv2}`);

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
        res = `mouse_position ${x},${y}`;
      }

      if (command === "prnt_scrn") {
        const base64_img = await capturePrntScrn({ x, y, h: 200, w: 200 });
        res = `prnt_scrn ${base64_img}`;
      }

      console.log(`${command} End`);

      callback(null, `${res}\0`);
    } catch (error) {
      callback(error as Error);
    }
  }
}

try {
  wss
    .on("connection", async (socket: WebSocket) => {
      const stream = createWebSocketStream(socket, {
        decodeStrings: false,
        encoding: "utf8",
        allowHalfOpen: false,
      });
      const transform = new MyTransform({
        decodeStrings: false,
        encoding: "utf8",
      });

      pipeline(stream, transform, stream, (err) => {
        if (err) {
          throw err;
        }
      });

      socket.on("close", () => stream.destroy());
    })
    .on("close", () => {
      console.log("Socket closed");
    });
} catch (error) {
  console.error("error", error);
}
