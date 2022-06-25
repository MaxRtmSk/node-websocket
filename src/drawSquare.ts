import robot from "robotjs";

export const drawSquare = (width: any) => {
  //   const mousePos = robot.getMousePos();

  const v: any = [
    `+ x ${width}`,
    `+ y ${width}`,
    `- x ${width}`,
    `- y ${width}`,
  ];

  for (let index = 0; index < v.length; index++) {
    const mousePos = robot.getMousePos();

    for (let i = 0; i <= width; i += 1) {
      robot.mouseToggle("down");

      const result: any = {
        x: mousePos.x,
        y: mousePos.y,
      };

      const [z, f] = v[index].split(" ");

      result[f] = z === "+" ? result[f] + i : result[f] - i;

      robot.dragMouse(result.x, result.y);
      robot.mouseToggle("up");
    }
  }
};
