// libs
import { useEffect, useState } from 'react'
import DataGrid, { CellClickArgs } from "react-data-grid";
// components
import { API_URL, fetchModEntries, fetchPosts, modEntriesColumns, postsColumns } from './components/api';
import { ModEntriesAPI, Post, PostsAPI } from './components/interfaces';
import Header from './components/Header';
import Footer from './components/Footer';
// css
import "./css/global.css";
import "react-data-grid/lib/styles.css";

function App() {
	const [data, setData] = useState<PostsAPI | null>(null);
	const [pageURL, setPageURL] = useState<string>(`${API_URL}/posts`);
	const [pageNum, setPageNum] = useState<number>(0);
	const [detailContent, setDetailContent] = useState<Post | null>(null);

	function handlePaginator(page: number) {
		const pageSize = 20; // add customizable pagesize in future?

		if(!data)
			return;

		setPageURL(`${API_URL}/posts?page=${page}&size=${pageSize}`);
		setPageNum(page);
	}

	function handleRowSelect(rows: CellClickArgs<NoInfer<Post>, unknown>) {
		setDetailContent(rows.row);
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
					{data === null ? "Loading..." :
						<DataGrid columns={postsColumns} 
							rows={data._embedded.posts} 
							onCellClick={(data) => handleRowSelect(data)} 
							className='rdg-dark data-grid'/>}
				</div>

				<div className='paginator'>
					{data && Array.from({ length: data?.page.totalPages }, (_, idx: number) => (
						<p className={pageNum === idx ? 'paginator-num selected' : 'paginator-num'} 
							key={idx} onClick={() => handlePaginator(idx)}>{idx+1}</p>
					))}
				</div>

				<div className='grid-detail-wrapper'>
					{detailContent === null ? "No Post Selected..." :
						<>
							<h3>{detailContent.title}</h3>
							<DataGrid columns={modEntriesColumns} 
							rows={detailContent.modEntries._embedded.modentries} 
							className='rdg-dark data-grid'/>
						</>}
				</div>
			</main>

			<Footer />
		</>
	)
}

export default App;