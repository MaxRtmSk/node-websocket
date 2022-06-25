import robot from "robotjs";

export const drawRectangle = (width: any, height?: any) => {
  const v: any = [
    `+ x ${width}`,
    `+ y ${height | width}`,
    `- x ${width}`,
    `- y ${height | width}`,
  ];

  for (let index = 0; index < v.length; index++) {
    const mousePos = robot.getMousePos();

    const [z, f, px] = v[index].split(" ");

    for (let i = 0; i <= px; i += 1) {
      robot.mouseToggle("down");

      const result: any = {
        x: mousePos.x,
        y: mousePos.y,
      };

      result[f] = z === "+" ? result[f] + i : result[f] - i;

      robot.dragMouse(result.x, result.y);
      robot.mouseToggle("up");
    }
  }
};
