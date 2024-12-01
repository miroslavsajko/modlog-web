import {useEffect, useState} from 'react'
import axios from "axios";
import "./css/global.css";
import "react-data-grid/lib/styles.css";
import DataGrid from "react-data-grid";

const API_URL = import.meta.env.VITE_API_URL;

const postsColumns = [
	{ key: "title", name: "Title" },
	{ key: "author", name: "Author" },
	{ key: "flair", name: "Flair" },
	{ key: "comments", name: "Comments" },
	{ key: "upvotes", name: "Upvotes" }
];

// const modEntriesColumns = [
// 	{ key: "action", name: "Action" },
// 	{ key: "mod", name: "Moderator" },
// 	{ key: "details", name: "Details" },
// 	{ key: "description", name: "Description" },
// 	{ key: "timestamp", name: "Timestamp" }
// ];

const fetchPosts = async () => {
	console.info(API_URL)
	return await axios.get(`${API_URL}/posts`).then(response => response.data).catch(reason => console.error(reason));
}

// const fetchModEntries = async (modEntriesURL: string) => {
// 	console.info(modEntriesURL);
// 	return await axios.get(`${modEntriesURL}`).then(response => response.data).catch(reason => console.error(reason));
// }

interface Post {
	title: string;
	author: string;
	flair: string;
	score: number;
	comments: number;
	_links: {
		self: string;
		post: string;
		modEntries: string;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	modEntries: any[];
}

interface Page {
	size: number;
	totalElements: number;
	totalPages: number;
	number: number;
}

interface PostsAPI {
	_embedded: {
		posts: Post[];
	};
	_links: {
		first: {
			href: string;
		};
		self: {
			href: string;
		};
		next: {
			href: string;
		};
		last: {
			href: string;
		};
		profile: {
			href: string;
		};
	};
	page: Page;
}

function App() {
	const [data, setData] = useState<PostsAPI | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const data: PostsAPI = await fetchPosts();
			console.log(data);
			setData(data);
		}

		fetchData();
	}, []);

	return (
		<>
			<header>
				<h1>r/Slovakia ModLog</h1>
			</header>

			<main>
				<div className='grid-wrapper'>
					<DataGrid columns={postsColumns} rows={data!._embedded.posts}/>
				</div>
			</main>

			<footer></footer>
		</>
	)
}

export default App;