export default {
	async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {

		// non-functional yet
		return new Response(
			JSON.stringify({status: 501, message: "Not Implemented"}),
			{ status: 501, statusText: "Not Implemented", headers: {
					"Content-Type": "application/json",
					"Cache-Control": "no-store",
					"Access-Control-Allow-Origin": "*",
					"X-Content-Type-Options": "nosniff"
				} }
		);
	},
};
