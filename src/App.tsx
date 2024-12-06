import { useEffect, useState } from 'react'
import axios from "axios";
import { ModEntriesAPI, PostsAPI } from './components/interfaces';
import Header from './components/Header';
import Footer from './components/Footer';
import "./css/global.css";
// datagrid
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";

const API_URL: string = import.meta.env.VITE_API_URL;
const DEBUG_MODE: boolean = import.meta.env.DEBUG === 1 ? true : false;

const postsColumns = [
	{ key: "title", name: "Title" },
	{ key: "author", name: "Author" },
	{ key: "flair", name: "Flair" },
	{ key: "comments", name: "Comments" },
	{ key: "score", name: "Upvotes" },
];

// const modEntriesColumns = [
// 	{ key: "action", name: "Action" },
// 	{ key: "mod", name: "Moderator" },
// 	{ key: "details", name: "Details" },
// 	{ key: "description", name: "Description" },
// 	{ key: "timestamp", name: "Timestamp" }
// ];

const fetchPosts = async (requestedURL: string) => {
	if(DEBUG_MODE)
		console.info(API_URL);
	return await axios.get(`${requestedURL}`).then(response => response.data).catch(reason => console.error(reason));
}

const fetchModEntries = async (modEntriesURL: string) => {
	if(DEBUG_MODE)
		console.info(modEntriesURL);
	// urls in APIs are returned with http, not https -> throwing CORS error
	const moddedURL = modEntriesURL.replace(/^http:\/\//, 'https://');
	return await axios.get(moddedURL).then(response => response.data).catch(reason => console.error(reason));
}

function App() {
	const [data, setData] = useState<PostsAPI | null>(null);
	const [pageURL, setPageURL] = useState<string>(`${API_URL}/posts`);
	const [pageNum, setPageNum] = useState<number>(0);

	function handlePaginator(page: number) {
		const pageSize = 20;

		if(!data)
			return;

		setPageURL(`https://modlog-api.up.railway.app/posts?page=${page}&size=${pageSize}`);
		setPageNum(page);
	}

	useEffect(() => {
		const fetchData = async () => {
			const data: PostsAPI = await fetchPosts(pageURL);

			data._embedded.posts.forEach(async post => {
				const modEntriesData: ModEntriesAPI = await fetchModEntries(post._links.modEntries.href);
				post.modEntries = modEntriesData;
			});

			setData(data);
		}

		fetchData();
	}, [pageURL]);

	return (
		<>
			<Header />

			<main>
				<div className='grid-wrapper'>
					{data == null ? "Loading..." :
						<DataGrid columns={postsColumns} rows={data._embedded.posts} className='rdg-dark data-grid' />}
				</div>

				<div className='paginator'>
					{data && Array.from({ length: data?.page.totalPages }, (_, idx: number) => (
						<p className={pageNum === idx ? 'paginator-num selected' : 'paginator-num'} 
							key={idx} onClick={() => handlePaginator(idx)}>{idx+1}</p>
					))}
				</div>
			</main>

			<Footer />
		</>
	)
}

export default App;