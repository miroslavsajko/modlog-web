import axios from "axios";
import {ChartData, ModEntriesAPIResponse, ModlogAPIResponse, PostsAPIResponse} from "../types/interfaces.ts";
export const API_URL: string = import.meta.env.VITE_API_URL;
const DEBUG_MODE = import.meta.env.VITE_IS_DEV ?? 0;

export interface FetchParams {
	sort?: string,
	sortDirection?: string,
	page?: number,
	pageSize?: number,
	filter?: string
}

export const fetchPosts = async ({sort = 'timestamp', sortDirection = 'desc', page = 0, pageSize = 15, filter}: FetchParams) => {

	const baseUrl = new URL(`${API_URL}/posts`);
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set('sort', sort)
	urlSearchParams.set('order', sortDirection)
	urlSearchParams.set('page', `${page}`)
	urlSearchParams.set('pageSize', `${pageSize}`)
	if (filter && filter.length > 0) {
		urlSearchParams.set('filter', `${filter}`)
	}
	baseUrl.search = urlSearchParams.toString()

	const postsApiUrl = baseUrl.toString();

	if (DEBUG_MODE)
		console.info(postsApiUrl);

	return await axios.get<PostsAPIResponse>(postsApiUrl).then(response =>
		response.data
	);
}

export const fetchModEntries = async ({sort = 'timestamp', sortDirection = 'desc', page = 0, pageSize = 15, filter}: FetchParams) => {
	const modEntriesApiUrl = new URL(`${API_URL}/modlog`)
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set('sort', sort)
	urlSearchParams.set('order', sortDirection)
	urlSearchParams.set('page', `${page}`)
	urlSearchParams.set('pageSize', `${pageSize}`)
	if (filter && filter.length > 0) {
		urlSearchParams.set('filter', `${filter}`)
	}
	modEntriesApiUrl.search = urlSearchParams.toString()

	const apiUrl = modEntriesApiUrl.toString();

	if (DEBUG_MODE)
		console.info(apiUrl);

	return await axios.get<ModlogAPIResponse>(apiUrl).then(response =>
		response.data
	);
}

export const fetchModEntriesForPost = async (postId: string) => {
	const modEntriesApiUrl = `${API_URL}/posts/${postId}/modEntries`
	if (DEBUG_MODE)
		console.info(modEntriesApiUrl);
	
	return await axios.get<ModEntriesAPIResponse>(modEntriesApiUrl).then(response =>
		response.data.modEntries
	);
}

export const fetchChartData = async (period:string) => {
	const baseUrl = new URL(`${API_URL}/charts/actions`);
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set('period', period)
	baseUrl.search = urlSearchParams.toString()

	const chartActionsUrl = baseUrl.toString();

	if (DEBUG_MODE)
		console.info(chartActionsUrl);

	return await axios.get<ChartData[]>(chartActionsUrl).then(response =>
		response.data
	);
}

