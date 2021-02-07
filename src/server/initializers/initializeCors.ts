require("dotenv").config();
import cors, { CorsOptions } from "cors";
import { isProduction, host } from "../../auxiliaries/server";
import { Express } from "express";
export default function initializeCors(app: Express): void {
	let whitelist: string[];
	if (isProduction) whitelist = [process.env.FRONTEND_URL as string, process.env.ADMIN_FRONTEND_URL as string, `http//${host}`];
	else
		whitelist = [
			`http://localhost:3000`, // ? Dev App
			`https://localhost:3000`, // ? Dev App
			host, // ? Backend
			`http://localhost:9000`,
			`http://localhost:1000`, // ? Dev Admin
			`https://localhost:1000`, // ? Dev Admin
		];

	const corsOptions: CorsOptions = {
		credentials: true,
		origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
			if (!origin) callback(null, true);
			else if (whitelist.indexOf(origin) !== -1) callback(null, true);
			else callback(new Error(`${origin} is not allowed by CORS`));
		},
	};

	app.use(cors(corsOptions));
}
