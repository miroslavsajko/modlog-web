import "../css/datagrid.scss";
import { ModEntriesAPI, ModEntry, Post, PostsAPI } from "./interfaces";

interface MasterDetailGridInterface {
	data: PostsAPI;
}

export function MasterDetailGrid({ data }: MasterDetailGridInterface) {
	if (data === null) return <LoadingIcon />;

	return (
		<div className="dg-wrapper">
			<div className="dg-header">
				<div className="dg-header-cell">Title</div>
				<div className="dg-header-cell">Author</div>
				<div className="dg-header-cell">Flair</div>
				<div className="dg-header-cell">Comments</div>
				<div className="dg-header-cell">Upvotes</div>
				<div className="dg-header-cell">Date</div>
			</div>

			<div className="dg-body">
				{data._embedded.posts.map((post, idx) => (
					<MasterGridRow key={idx} post={post}/>
				))}
			</div>
		</div>
	)
}

interface MasterGridRowInterface {
	post: Post;
}

function MasterGridRow({ post }: MasterGridRowInterface) {
	return (
		<div className="dg-row">
			<div className="dg-row-master">
				<div className="dg-cell">{post.title}</div>
				<div className="dg-cell">{post.author}</div>
				<div className="dg-cell">{post.flair}</div>
				<div className="dg-cell">{post.comments}</div>
				<div className="dg-cell">{post.score}</div>
				<div className="dg-cell">{post.timestamp}</div>
			</div>
			<div className="dg-row-detail">
				<DetailGrid entries={null} /> {/* need to add modentries to post struct */}
			</div>
		</div>
	)
}

interface DetailGridInterface {
	entries: ModEntriesAPI | null;
}

function DetailGrid({ entries: modEntries }: DetailGridInterface) {
	if(modEntries === null) return <LoadingIcon />;

	return (
		<div className="dtg-wrapper">
			<div className="dtg-header">
				<div className="dtg-header-cell">Action</div>
				<div className="dtg-header-cell">Moderator</div>
				<div className="dtg-header-cell">Details</div>
				<div className="dtg-header-cell">Description</div>
				<div className="dtg-header-cell">Date</div>
			</div>

			<div className="dtg-body">
				{modEntries._embedded.modentries.map((entry, idx) => (
					<DetailGridRow modEntry={entry} key={idx} />
				))}
			</div>
		</div>
	)
}

interface DetailGridRowInterface {
	modEntry: ModEntry;
}

function DetailGridRow({ modEntry }: DetailGridRowInterface) {
	return (
		<div className="dtg-row">
			<div className="dtg-cell">{modEntry.action}</div>
			<div className="dtg-cell">{modEntry.mod}</div>
			<div className="dtg-cell">{modEntry.details}</div>
			<div className="dtg-cell">{modEntry.description}</div>
			<div className="dtg-cell">{modEntry.timestamp}</div>
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