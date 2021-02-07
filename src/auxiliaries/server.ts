import * as path from "path";
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT ? process.env.PORT : 8000;
const host = `http${isProduction ? `` : `s`}://localhost:${port}`;
const publicFolder = process.env.STATIC_DIRECTORY || path.join(__dirname, "../../public/");
export { isProduction, port, host, publicFolder };
