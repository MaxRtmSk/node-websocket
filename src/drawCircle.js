import robot from "robotjs";

export const drawCircle = (radius) => {
  const mousePos = robot.getMousePos();

  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    // Convert polar coordinates to cartesian
    const x = mousePos.x + radius * Math.cos(i);
    const y = mousePos.y + radius * Math.sin(i);

    robot.dragMouse(x, y);
  }
};
