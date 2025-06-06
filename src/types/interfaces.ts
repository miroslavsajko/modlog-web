export interface Post {
	title: string;
	author: string;
	flair: string;
	timestamp: string;
	score: number;
	comments: number;
	postid: string;
}

export interface Page {
	size: number;
	totalElements: number;
	totalPages: number;
	number: number;
}

export interface PostsAPIResponse {
	posts: Post[];
	page: Page;
}

export interface ModEntry {
	action: string;
	mod: string;
	details: string;
	description: string;
	timestamp: string;
}

export interface ModEntriesAPIResponse {
	modEntries: ModEntry[];
}