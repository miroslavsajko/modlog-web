// libs
import { useEffect, useState } from 'react'
// components
import { API_URL, fetchApiData } from './components/api';
import { PostsAPI } from './components/interfaces';
import { LoadingIcon, MasterDetailGrid, MobileWarning } from './components/NewDataGrid';
import { Paginator } from './components/Paginator';
import Header from './components/Header';
import Footer from './components/Footer';
// css
import "./css/global.scss";

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
				<MobileWarning/>

				{data === null ? <LoadingIcon /> : <MasterDetailGrid data={data} selectedPosts={selectedPosts} setSelectedPosts={setSelectedPosts} setData={setData} />}

				{data && <Paginator data={data} pageNum={pageNum} pageSize={pageSize} setPageURL={setPageURL} setData={setData} setPageNum={setPageNum} />}
			</main>

			<Footer />
		</>
	)
}

export default MasterDetail;