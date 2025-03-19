import { CellClickArgs, DataGrid } from "react-data-grid";
import { ModEntriesAPI, Post, PostsAPI } from "./interfaces";
import { modEntriesColumns, postsColumns } from "./api";

interface DetailGridInterface {
	detailPost: Post;
	detailModEntries: ModEntriesAPI;
}

interface MainDataGridInterface {
	data: PostsAPI;
	detailPost: Post | null;
	setDetailContent: React.Dispatch<React.SetStateAction<Post | null>>;
	setDetailedModEntries: React.Dispatch<React.SetStateAction<ModEntriesAPI | null>>;
}

export function NoPostSelected() {
	return (
		<div className='grid-wrapper'>
			<p>Click on a post to see actions of moderators</p>
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

export function MainDataGrid({ data, detailPost, setDetailContent, setDetailedModEntries }: MainDataGridInterface) {
	function handleRowSelect(rows: CellClickArgs<Post, unknown>) {
		if(detailPost === rows.row) {
			setDetailContent(null);
			setDetailedModEntries(null);
			return;
		}

		setDetailContent(rows.row);
		setDetailedModEntries(null);
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

export function DetailGrid({ detailPost, detailModEntries }: DetailGridInterface) {
	return (
		<div className='grid-detail-wrapper'>
			<>
				<h3>{detailPost.title}</h3>

				<a className='post-link'
					href={`https://www.reddit.com/r/Slovakia/comments/${detailPost.postId}`}
					target='_blank' rel='noopener noreferrer'>Post Link</a>

				<DataGrid columns={modEntriesColumns}
					rows={detailModEntries._embedded.modentries}
					className='rdg-dark data-grid data-modentries' />
			</>
		</div>
	)
}