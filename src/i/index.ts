export default {
	async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname.replace(/^\/+/, "");

		if (!path) {
			return new Response(
				JSON.stringify({status: 400, message: "Missing Path"}),
				{ status: 400, statusText: "Missing Path", headers: {
						"Content-Type": "application/json",
						"Cache-Control": "public, max-age=60",
						"Access-Control-Allow-Origin": "*",
						"X-Content-Type-Options": "nosniff"
					} }
			);
		}

		const backends = [
			"https://reflecta-s0.r2.roax.world",
			"https://reflecta-s1.r2.roax.world",
		];

		const exts = ["png", "jpg", "jpeg", "gif", "ico", "webp"];

		const candidates: string[] = [];
		for (const backend of backends) {
			for (const ext of exts) {
				candidates.push(`${backend}/${path}.${ext}`);
			}
		}

		const cache = caches.default;
		const cacheKey = new Request(request.url, request);

		const cached = await cache.match(cacheKey);
		if (cached) {
			return cached;
		}

		const fetches = candidates.map(async (url) => {
			try {
				const res = await fetch(url, { method: "GET" });
				if (res.ok) {
					return { url, res };
				}
			} catch {
				// ignore
			}
			return null;
		});

		const results = await Promise.all(fetches);
		const found = results.find((r) => r !== null);

		if (!found) {
			return new Response(
				JSON.stringify({status: 404, message: "Not Found"}),
				{ status: 404, statusText: "Not Found", headers: {
						"Content-Type": "application/json",
						"Cache-Control": "public, max-age=60",
						"Access-Control-Allow-Origin": "*",
						"X-Content-Type-Options": "nosniff"
					} }
			);
		}

		const response = new Response(found.res!.body, {
			status: found.res!.status,
			headers: found.res!.headers,
		});

		response.headers.set("X-Resolved-From", found.url);

		ctx.waitUntil(cache.put(cacheKey, response.clone()));

		return response;
	},
};
