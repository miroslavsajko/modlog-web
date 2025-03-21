// libs
import { useEffect, useState } from 'react'
// components
import { API_URL, fetchApiData, fetchModEntriesData } from './components/api';
import { ModEntriesAPI, Post, PostsAPI } from './components/interfaces';
import { Paginator } from './components/Paginator';
import { DetailGrid, LoadingIcon, MainDataGrid, NoPostSelected } from './components/DataGrids';
import Header from './components/Header';
import Footer from './components/Footer';
// css
import "./css/global.scss";
import "react-data-grid/lib/styles.css";
import { MasterDetailGrid } from './components/NewDataGrid';

function MasterDetail() {
	const pageSize = 15;
	const [data, setData] = useState<PostsAPI | null>(null);
	const [pageURL, setPageURL] = useState<string>(`${API_URL}/posts?sort=timestamp,desc&page=0&size=${pageSize}`);
	const [selectedPosts, setSelectedPosts] = useState<string[] | null>(null);
	const [pageNum, setPageNum] = useState<number>(0);

	useEffect(() => {
		fetchApiData({ pageURL, setData });
	}, [pageURL]);

	return (
		<>
			<Header />
		
			<main>
				{data === null ? <LoadingIcon /> : <MasterDetailGrid data={data} selectedPosts={selectedPosts} setSelectedPosts={setSelectedPosts} setData={setData} />}

				{data && <Paginator data={data} pageNum={pageNum} pageSize={pageSize} setPageURL={setPageURL} setData={setData} setPageNum={setPageNum} />}
			</main>

			<Footer />
		</>
	)
}

export default MasterDetail;