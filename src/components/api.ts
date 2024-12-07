import axios from "axios";
export const API_URL: string = import.meta.env.VITE_API_URL;
const DEBUG_MODE = 0;

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
	// urls in APIs are returned with http, not https -> throwing CORS error
	const moddedURL = modEntriesURL.replace(/^http:\/\//, 'https://');
	return await axios.get(moddedURL).then(response => response.data).catch(reason => console.error(reason));
}