import robot from "robotjs";
import Jimp from "jimp";

export const capturePrntScrn = async ({ x, y, w, h }: any) => {
  const pic = robot.screen.capture(x, y, w, h);
  const width = pic.byteWidth / pic.bytesPerPixel;
  const height = pic.height;
  const image = new Jimp(width, height);
  let red: any, green: any, blue: any;
  pic.image.forEach((byte: any, i: any) => {
    switch (i % 4) {
      case 0:
        return (blue = byte);
      case 1:
        return (green = byte);
      case 2:
        return (red = byte);
      case 3:
        image.bitmap.data[i - 3] = red;
        image.bitmap.data[i - 2] = green;
        image.bitmap.data[i - 1] = blue;
        image.bitmap.data[i] = 255;
    }
  });

  return (await image.getBase64Async(Jimp.MIME_PNG)).split(",")[1];
};
