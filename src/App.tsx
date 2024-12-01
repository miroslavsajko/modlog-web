import { useEffect, useState } from 'react'
import axios from "axios";
import DataGrid from "react-data-grid";
import { ModEntriesAPI, PostsAPI } from './components/interfaces';
import Header from './components/Header';
import Footer from './components/Footer';
import "./css/global.css";
import "react-data-grid/lib/styles.css";

const API_URL = import.meta.env.VITE_API_URL;

const postsColumns = [
	// { key: "expander", name: ""},
	{ key: "title", name: "Title" },
	{ key: "author", name: "Author" },
	{ key: "flair", name: "Flair" },
	{ key: "comments", name: "Comments" },
	{ key: "score", name: "Upvotes" }
];

// const modEntriesColumns = [
// 	{ key: "action", name: "Action" },
// 	{ key: "mod", name: "Moderator" },
// 	{ key: "details", name: "Details" },
// 	{ key: "description", name: "Description" },
// 	{ key: "timestamp", name: "Timestamp" }
// ];

const fetchPosts = async () => {
	// console.info(API_URL);
	return await axios.get(`${API_URL}/posts`).then(response => response.data).catch(reason => console.error(reason));
}

const fetchModEntries = async (modEntriesURL: string) => {
	// console.info(modEntriesURL);
	// urls in APIs are returned with http, not https -> throwing CORS error
	const moddedURL = modEntriesURL.replace(/^http:\/\//, 'https://');
	return await axios.get(moddedURL).then(response => response.data).catch(reason => console.error(reason));
}

function App() {
	const [data, setData] = useState<PostsAPI | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const data: PostsAPI = await fetchPosts();

			data._embedded.posts.forEach(async post => {
				const modEntriesData: ModEntriesAPI = await fetchModEntries(post._links.modEntries.href);
				post.modEntries = modEntriesData;
			});

			setData(data);
		}

		fetchData();
	}, []);

	return (
		<>
			<Header />

			<main>
				<div className='grid-wrapper'>
					{data == null ? "Loading..." :
						<DataGrid columns={postsColumns} rows={data._embedded.posts} className='rdg-dark data-grid' />}
				</div>
			</main>

			<Footer />
		</>
	)
}

export default App;