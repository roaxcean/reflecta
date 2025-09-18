import iHandler from "./i/index";
import fHandler from "./f/index";

export default {
	async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		let path = url.pathname.replace(/^\/+/, "");

		if (!path) {
			return new Response(
				JSON.stringify({ status: 400, message: "Missing Path", fromRoax: "oi!! what are u doing here omg?!! this is my subdomain for storing files!! ur not supposed to be hereeeeee" }),
				{
					status: 400,
					statusText: "Missing Path",
					headers: {
						"Content-Type": "application/json",
						"Cache-Control": "no-store",
						"Access-Control-Allow-Origin": "*",
						"X-Content-Type-Options": "nosniff",
					},
				}
			);
		}

		if (path.startsWith("i/")) {
			const newUrl = new URL(request.url);
			newUrl.pathname = "/" + path.substring(2);
			const newRequest = new Request(newUrl.toString(), request);
			return iHandler.fetch(newRequest, env, ctx);
		}

		if (path.startsWith("f/")) {
			const newUrl = new URL(request.url);
			newUrl.pathname = "/" + path.substring(2);
			const newRequest = new Request(newUrl.toString(), request);
			return fHandler.fetch(newRequest, env, ctx);
		}

		return new Response(
			JSON.stringify({ status: 404, message: "Not Found" }),
			{
				status: 404,
				statusText: "Not Found",
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "no-store",
					"Access-Control-Allow-Origin": "*",
					"X-Content-Type-Options": "nosniff",
				},
			}
		);
	},
};
