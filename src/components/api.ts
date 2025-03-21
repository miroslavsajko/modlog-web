import axios from "axios";
import { ModEntriesAPI, Post, PostsAPI } from "./interfaces";
import { convertDateTime } from "./dateTimeConverter";
export const API_URL: string = import.meta.env.VITE_API_URL;
const DEBUG_MODE = 0;
const MAX_TITLE_LENGTH = 80;
const MAX_USERNAME_LENGTH = 20;

export const postsColumns = [
	{ key: "title", name: "Title" },
	{ key: "author", name: "Author" },
	{ key: "flair", name: "Flair" },
	{ key: "comments", name: "Comments" },
	{ key: "score", name: "Upvotes" },
	{ key: "timestamp", name: "Date"}
];

export const modEntriesColumns = [
	{ key: "action", name: "Action" },
	{ key: "mod", name: "Moderator" },
	{ key: "details", name: "Details" },
	{ key: "description", name: "Description" },
	{ key: "timestamp", name: "Timestamp" }
];

export const fetchPosts = async (requestedURL: string) => {
	if(DEBUG_MODE)
		console.info(API_URL);
	return await axios.get(`${requestedURL}`).then(response => response.data).catch(reason => console.error(reason));
}

export const fetchModEntries = async (modEntriesURL: string) => {
	if(DEBUG_MODE)
		console.info(modEntriesURL);
	
	const moddedURL = modEntriesURL.replace(/^http:\/\//, 'https://');
	return await axios.get(moddedURL).then(response => response.data).catch(reason => console.error(reason));
}

interface FetchPostsInterface {
	pageURL: string;
	setData: React.Dispatch<React.SetStateAction<PostsAPI | null>>;
}

interface fetchModEntriesInterface {
	data: PostsAPI;
	post: Post;
	setData: React.Dispatch<React.SetStateAction<PostsAPI | null>>;
}

function truncateString(str: string, maxLength: number): string {
	return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}

export async function fetchApiData({ pageURL, setData }: FetchPostsInterface) {
	const data: PostsAPI = await fetchPosts(pageURL);

	for (const post of data._embedded.posts) {
		post.timestamp = convertDateTime(post.timestamp);
		post.title = truncateString(post.title, MAX_TITLE_LENGTH);
		post.author = truncateString(post.author, MAX_USERNAME_LENGTH);
		post.modEntries = null;
	}

	setData(data);
}

export async function fetchModEntriesData({ data, post, setData }: fetchModEntriesInterface) {
	const modEntriesData: ModEntriesAPI = await fetchModEntries(post._links.modEntries.href);

	modEntriesData._embedded.modentries.forEach(modEntry => {
		modEntry.timestamp = convertDateTime(modEntry.timestamp);
	});

	data._embedded.posts.filter(post => post.postId === post.postId)[0].modEntries = modEntriesData;
	setData(data);
}