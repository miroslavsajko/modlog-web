export interface Href {
	href: string;
}

// Posts API

export interface Post {
	title: string;
	author: string;
	flair: string;
	timestamp: string;
	score: number;
	comments: number;
	postId: string;
	_links: {
		self: Href;
		post: Href;
		modEntries: Href;
	};
	modEntries: ModEntriesAPI | null;
}

export interface Page {
	size: number;
	totalElements: number;
	totalPages: number;
	number: number;
}

export interface PostsAPI {
	_embedded: {
		posts: Post[];
	};
	_links: {
		first: Href;
		self: Href;
		next: Href;
		last: Href;
		profile: Href;
	};
	page: Page;
}

// Mod Entries API

export interface ModEntry {
	action: string;
	mod: string;
	details: string;
	description: string;
	timestamp: string;
	_links: {
		self: Href;
		modentry: Href;
		post: Href;
	};
}

export interface ModEntriesAPI {
	_embedded: {
		modentries: ModEntry[];
	};
	_links: {
		self: Href;
	};
}