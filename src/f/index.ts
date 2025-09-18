export default {
	async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname.replace(/^\/+/, "");

		if (!path) {
			return new Response(
				JSON.stringify({status: 400, message: "Missing Path"}),
				{ status: 400, statusText: "Missing Path", headers: {
						"Content-Type": "application/json",
						"Cache-Control": "no-store",
						"Access-Control-Allow-Origin": "*",
						"X-Content-Type-Options": "nosniff"
					} }
			);
		}

		// yes i know i mixed these up, but its too late to change now :shrugs:
		const backends = [
			"https://reflecta-s2.r2.roax.world", // aethra cdn 2
			"https://reflecta-s3.r2.roax.world", // aethra cdn 1
		];

		// fHandler has to have extensions in URL, otherwise we would be checking thousands of Exts, not mentioning the
		// pain of having two files of the same name, but different file type (ext)
		const candidates: string[] = [];
		for (const backend of backends) {
			candidates.push(`${backend}/${path}`);
		}

		const cache = caches.default;
		const cacheKey = new Request(request.url, request);

		const cached = await cache.match(cacheKey);
		if (cached) {
			return cached;
		}

		const fetches = candidates.map(async (url) => {
			try {
				const res = await fetch(url);
				if (res.ok && res.body) {
					const headers = new Headers(res.headers);
					headers.set("X-Resolved-From", url);
					const body = await res.arrayBuffer();
					return new Response(body, { status: res.status, headers });
				}
			} catch {
				// ignore broken backend
			}
			return null;
		});

		const results = await Promise.all(fetches);
		const found = results.find(r => r !== null);

		if (!found) {
			return new Response(
				JSON.stringify({ status: 404, message: "Not Found" }),
				{
					status: 404,
					headers: {
						"Content-Type": "application/json",
						"Cache-Control": "no-store",
						"Access-Control-Allow-Origin": "*",
						"X-Content-Type-Options": "nosniff",
					},
				}
			);
		}

		ctx.waitUntil(cache.put(cacheKey, found.clone()));
		return found;
	},
};
