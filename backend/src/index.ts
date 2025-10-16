
export default {
	async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
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
