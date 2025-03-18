import { CellClickArgs, DataGrid } from "react-data-grid";
import { Post, PostsAPI } from "./interfaces";
import { modEntriesColumns, postsColumns } from "./api";

interface DetailGridInterface {
	detailContent: Post;
}

interface MainDataGridInterface {
	data: PostsAPI;
	setDetailContent: React.Dispatch<React.SetStateAction<Post | null>>;
}

export function NoPostSelected() {
	return (
		<div className='grid-wrapper'>
			<p>"No Post Selected..."</p>
		</div>
	)
}

export function LoadingIcon() {
	return (
		<div className='grid-wrapper'>
			<div className='loading-icon'></div>
		</div>
	);
}

export function MainDataGrid({ data, setDetailContent }: MainDataGridInterface) {
	function handleRowSelect(rows: CellClickArgs<Post, unknown>) {
		setDetailContent(rows.row);
	}

	return (
		<div className='grid-wrapper'>
			<DataGrid columns={postsColumns}
				rows={data._embedded.posts}
				onCellClick={(data) => handleRowSelect(data)}
				className='rdg-dark data-grid data-posts' />
		</div>
	)
}

export function DetailGrid({ detailContent }: DetailGridInterface) {
	return (
		<div className='grid-detail-wrapper'>
			<>
				<h3>{detailContent.title}</h3>

				<a className='post-link'
					href={`https://www.reddit.com/r/Slovakia/comments/${detailContent.postId}`}
					target='_blank'>Post Link</a>

				<DataGrid columns={modEntriesColumns}
					rows={detailContent.modEntries._embedded.modentries}
					className='rdg-dark data-grid data-modentries' />
			</>
		</div>
	)
}