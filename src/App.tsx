// libs
import { useEffect, useState } from 'react'
// components
import { API_URL, fetchModEntries, fetchPosts } from './components/api';
import { ModEntriesAPI, Post, PostsAPI } from './components/interfaces';
import { Paginator } from './components/Paginator';
import { convertDateTime } from './components/dateTimeConverter';
import Header from './components/Header';
import Footer from './components/Footer';
// css
import "./css/global.scss";
import "react-data-grid/lib/styles.css";
import { DetailGrid, LoadingIcon, MainDataGrid, NoPostSelected } from './components/DataGrids';

function App() {
	const pageSize = 15;
	const [data, setData] = useState<PostsAPI | null>(null);
	const [pageURL, setPageURL] = useState<string>(`${API_URL}/posts?sort=timestamp,desc&page=0&size=${pageSize}`);
	const [pageNum, setPageNum] = useState<number>(0);
	const [detailContent, setDetailContent] = useState<Post | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const data: PostsAPI = await fetchPosts(pageURL);

			for (const post of data._embedded.posts) {
				post.timestamp = convertDateTime(post.timestamp);

				const modEntriesData: ModEntriesAPI = await fetchModEntries(post._links.modEntries.href);
				post.modEntries = modEntriesData;

				post.modEntries._embedded.modentries.forEach(modEntry => {
					modEntry.timestamp = convertDateTime(modEntry.timestamp);
				})
			}

			setData(data);
		}

		fetchData();
	}, [pageURL]);

	return (
		<>
			<Header />

			<main>
				{data === null ? <LoadingIcon /> : <MainDataGrid data={data} setDetailContent={setDetailContent} />}

				{data && <Paginator data={data} pageNum={pageNum} pageSize={pageSize} setPageURL={setPageURL} setData={setData} setPageNum={setPageNum} />}

				{detailContent === null ? <NoPostSelected /> :
					<DetailGrid detailContent={detailContent} />}
			</main>

			<Footer />
		</>
	)
}

export default App;