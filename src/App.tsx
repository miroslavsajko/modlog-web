// libs
import { useEffect, useState } from 'react'
// components
import { API_URL, fetchApiData } from './components/api';
import { Post, PostsAPI } from './components/interfaces';
import { Paginator } from './components/Paginator';
import { DetailGrid, LoadingIcon, MainDataGrid, NoPostSelected } from './components/DataGrids';
import Header from './components/Header';
import Footer from './components/Footer';
// css
import "./css/global.scss";
import "react-data-grid/lib/styles.css";

function App() {
	const pageSize = 15;
	const [data, setData] = useState<PostsAPI | null>(null);
	const [pageURL, setPageURL] = useState<string>(`${API_URL}/posts?sort=timestamp,desc&page=0&size=${pageSize}`);
	const [pageNum, setPageNum] = useState<number>(0);
	const [detailContent, setDetailContent] = useState<Post | null>(null);

	useEffect(() => {
		fetchApiData({ pageURL, setData });
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