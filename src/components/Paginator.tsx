import { API_URL } from "./api";
import { PostsAPI } from "./interfaces";

interface PaginatorInterface {
	data: PostsAPI | null;
	pageNum: number;
	pageSize: number;
	setPageURL: React.Dispatch<React.SetStateAction<string>>;
	setData: React.Dispatch<React.SetStateAction<PostsAPI | null>>;
	setPageNum: React.Dispatch<React.SetStateAction<number>>;
}

export function Paginator({ data, pageNum, pageSize, setPageURL, setData, setPageNum, }: PaginatorInterface) {
	function handlePaginator(page: number) {
		if (!data) return;
		if (page === pageNum) return;
		if (page < 0 || page >= data.page.totalPages) return;

		setData(null);
		setPageURL(`${API_URL}/posts?sort=timestamp,desc&page=${page}&size=${pageSize}`);
		setPageNum(page);
	}

	if (data === null) return null;
	
	const visiblePagesIdx = [];
	for (let i = pageNum - 2; i <= pageNum + 2; i++) {
		visiblePagesIdx.push(i);
	}

	return (
		<div className="paginator">
			{pageNum === 0 ? <p key={0} className="paginator-void"></p> :
				<p className="paginator-num" key={0} onClick={() => handlePaginator(0)} aria-label="First Page">
					{"<<"}
				</p>}

			{visiblePagesIdx.map((idx) =>
				idx + 1 < 1 || idx + 1 > data.page.totalPages ? (
					<p key={idx} className="paginator-void"></p>
				) : (
					<p
						key={idx}
						className={`paginator-num ${pageNum === idx ? "selected" : ""}`}
						onClick={() => handlePaginator(idx)}
					>
						{idx + 1}
					</p>
				)
			)}

			{pageNum === data.page.totalPages - 1 ? <p key={data?.page.totalPages} className="paginator-void"></p> :
				<p className="paginator-num" key={data?.page.totalPages}
					onClick={() => { handlePaginator(data.page.totalPages - 1); }} aria-label="Last Page">
					{">>"}
				</p>}
		</div>
	);
}