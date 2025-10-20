export default {
	async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {

		const url = new URL(request.url);
		let path = url.pathname.replace(/^\/+/, "");
		const method = request.method.toUpperCase();
		const token = env.api_token;

		if (!path) {
			return new Response(
				JSON.stringify({ status: 400, message: "Missing Path" }),
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

		if (path === "/data/put" && method === "POST") {
			const authHeader = request.headers.get("Authorization") || "";
			if (!authHeader.startsWith("Bearer ") || authHeader.slice(7) !== token) {
				return new Response(
					JSON.stringify({ status: 401, message: "Unauthorized" }),
					{
						status: 401,
						statusText: "Unauthorized",
						headers: {
							"Content-Type": "application/json",
							"Cache-Control": "no-store",
							"Access-Control-Allow-Origin": "*",
							"X-Content-Type-Options": "nosniff",
						},
					}
				);
			}

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
