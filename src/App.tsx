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

function convertDateTime(isoDateTime: string) {
	const timeFormat = new Intl.DateTimeFormat("sk-SK", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	})

	return timeFormat.format(new Date(isoDateTime));
}

function App() {
	const pageSize = 8;
	const [data, setData] = useState<PostsAPI | null>(null);
	const [pageURL, setPageURL] = useState<string>(`${API_URL}/posts?sort=timestamp,desc&page=0&size=${pageSize}`);
	const [pageNum, setPageNum] = useState<number>(0);
	const [detailContent, setDetailContent] = useState<Post | null>(null);

	function Paginator() {
		if (data === null) return ("");

		const pagesCount = data.page.totalPages;
		const visiblePagesIdx = [];

		for (let i = Math.max(0, pageNum - 2); i <= Math.min(pagesCount - 1, pageNum + 2); i++) {
			if (i === 0 || i === pagesCount - 1)
				continue;
			visiblePagesIdx.push(i);
		}

		return (
			<div className='paginator'>
				{/* First */}
				<p className={pageNum === 0 ? 'paginator-num selected' : 'paginator-num'}
					key={0} onClick={() => handlePaginator(0)}>First</p>

				{/* Page Numbers */}
				{visiblePagesIdx.map(idx => (
					<p key={idx}
						className={`paginator-num ${pageNum === idx ? 'selected' : ''}`}
						onClick={() => handlePaginator(idx)}>
						{idx + 1}
					</p>
				))}

				{/* Last */}
				<p className={pageNum === data.page.totalPages - 1 ? 'paginator-num selected' : 'paginator-num'}
					key={data?.page.totalPages} onClick={() => {
						// if(data === null) return;
						handlePaginator(data.page.totalPages - 1);
					}}>Last</p>
			</div>
		);
	}

	function handlePaginator(page: number) {
		if (!data)
			return;

		setPageURL(`${API_URL}/posts?sort=timestamp,desc&page=${page}&size=${pageSize}`);
		setPageNum(page);
	}

	function handleRowSelect(rows: CellClickArgs<NoInfer<Post>, unknown>) {
		setDetailContent(rows.row);
	}

	useEffect(() => {
		const fetchData = async () => {
			const data: PostsAPI = await fetchPosts(pageURL);

			data._embedded.posts.forEach(async post => {
				post.timestamp = convertDateTime(post.timestamp);

				const modEntriesData: ModEntriesAPI = await fetchModEntries(post._links.modEntries.href);
				post.modEntries = modEntriesData;

				post.modEntries._embedded.modentries.forEach(modEntry => {
					modEntry.timestamp = convertDateTime(modEntry.timestamp);
				})
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
							className='rdg-dark data-grid' />}
				</div>

				{data === null ? "" : <Paginator />}

				<div className='grid-detail-wrapper'>
					{detailContent === null ? "No Post Selected..." :
						<>
							<h3>{detailContent.title}</h3>
							<a className='post-link'
								href={`https://www.reddit.com/r/Slovakia/comments/${detailContent.postId}`}
								target='_blank'>Post Link</a>
							<DataGrid columns={modEntriesColumns}
								rows={detailContent.modEntries._embedded.modentries}
								className='rdg-dark data-grid' />
						</>}
				</div>
			</main>

			<Footer />
		</>
	)
}

export default App;