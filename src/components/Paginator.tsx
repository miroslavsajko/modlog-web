import { PostsAPIResponse } from "../types/interfaces.ts";

interface PaginatorInterface {
	data: PostsAPIResponse | null;
	pageNum: number;
	setPageNum: React.Dispatch<React.SetStateAction<number>>;
}

export function Paginator({ data, pageNum, setPageNum }: PaginatorInterface) {
	function handlePaginator(page: number) {
		if (!data) return;
		if (page === pageNum) return;
		if (page < 0 || page >= data.page.totalPages) return;

		setPageNum(page);
	}

	if (data === null || data.page.totalPages < 1) return <></>;
	
	const visiblePagesIdx = [];
	for (let i = Math.max(pageNum - 2, 0); i <= Math.min(pageNum + 2, data.page.totalPages - 1); i++) {
		visiblePagesIdx.push(i);
	}

	return (
		<div className="paginator">
			{pageNum === 0 ? <p key={0} className="paginator-void"></p> :
				<p className="paginator-num" key={0} onClick={() => handlePaginator(0)} aria-label="First Page">
					{"<<"}
				</p>}

			{visiblePagesIdx.map((idx) =>
				<p
					key={idx}
					className={`paginator-num ${pageNum === idx ? "selected" : ""}`}
					onClick={() => handlePaginator(idx)}
				>
					{idx + 1}
				</p>
			)}

			{pageNum === data.page.totalPages - 1 ? <p key={data?.page.totalPages} className="paginator-void"></p> :
				<p className="paginator-num" key={data?.page.totalPages}
					onClick={() => { handlePaginator(data.page.totalPages - 1); }} aria-label="Last Page">
					{">>"}
				</p>}
		</div>
	);
}