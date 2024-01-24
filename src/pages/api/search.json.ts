import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export const GET: APIRoute = async ({ url }): Promise<Response> => {
	const query: string | null = url.searchParams.get("query");
	// console.log(query);
	// handle if query is empty
	if (!query) {
		return new Response(
			JSON.stringify({ error: "Query param is required" }),
			{
				status: 400, // BAD REQUEST
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}

	const allBlogArticles: CollectionEntry<"blog">[] = await getCollection(
		"blog"
	);
	// console.log(allBlogArticles);

	// Filter articles based on query
	const searchResults = allBlogArticles.filter((article) => {
		const titleMatch: boolean = article.data.title
			.toLowerCase()
			.includes(query!.toLowerCase());

		const bodyMatch: boolean = article.body
			.toLowerCase()
			.includes(query!.toLowerCase());

		const slugMatch: boolean = article.slug
			.toLowerCase()
			.includes(query!.toLowerCase());

		return titleMatch || bodyMatch || slugMatch;
	});

	return new Response(JSON.stringify({ searchResults }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
