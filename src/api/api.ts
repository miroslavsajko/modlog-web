import axios from "axios";
import {ModEntriesAPIResponse, PostsAPIResponse} from "../types/interfaces.ts";
export const API_URL: string = import.meta.env.VITE_API_URL;
const DEBUG_MODE = import.meta.env.VITE_IS_DEV ?? 0;

export interface FetchPostsParams {
	sort?: string,
	sortDirection?: string,
	page?: number,
	pageSize?: number
}

export const fetchPosts = async ({sort = 'timestamp', sortDirection = 'desc', page = 0, pageSize = 15}: FetchPostsParams) => {

	const baseUrl = new URL(`${API_URL}/posts`);
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set('sort', sort)
	urlSearchParams.set('order', sortDirection)
	urlSearchParams.set('page', `${page}`)
	urlSearchParams.set('pageSize', `${pageSize}`)
	baseUrl.search = urlSearchParams.toString()

	const postsApiUrl = baseUrl.toString();

	if (DEBUG_MODE)
		console.info(postsApiUrl);

	return await axios.get<PostsAPIResponse>(postsApiUrl).then(response =>
		response.data
	);
}

export const fetchModEntries = async (postId: string) => {
	const modEntriesApiUrl = `${API_URL}/posts/${postId}/modEntries`
	if (DEBUG_MODE)
		console.info(modEntriesApiUrl);
	
	return await axios.get<ModEntriesAPIResponse>(modEntriesApiUrl).then(response =>
		response.data.modEntries
	);
}

