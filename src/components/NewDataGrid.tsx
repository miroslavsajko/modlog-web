import "../css/datagrid.scss";
import { fetchModEntriesData } from "./api";
import { ModEntriesAPI, ModEntry, Post, PostsAPI } from "./interfaces";

interface MasterDetailGridInterface {
	data: PostsAPI;
	selectedPosts: string[] | null;
	setSelectedPosts: React.Dispatch<React.SetStateAction<string[] | null>>
	setData: React.Dispatch<React.SetStateAction<PostsAPI | null>>;
}

export function MasterDetailGrid({ data, selectedPosts, setSelectedPosts, setData }: MasterDetailGridInterface) {
	if (data === null) return <LoadingIcon />;

	return (
		<div className="dg-wrapper">
			<div className="dg-header">
				<div className="dg-header-cell">Title</div>
				<div className="dg-header-cell">Author</div>
				<div className="dg-header-cell">Flair</div>
				<div className="dg-header-cell dg-center">Comments</div>
				<div className="dg-header-cell dg-center">Upvotes</div>
				<div className="dg-header-cell">Date</div>
			</div>

			<div className="dg-body">
				{data._embedded.posts.map((post, idx) => (
					<MasterGridRow key={idx} post={post} data={data} setData={setData} selectedPosts={selectedPosts} setSelectedPosts={setSelectedPosts} />
				))}
			</div>
		</div>
	)
}

interface MasterGridRowInterface {
	data: PostsAPI;
	post: Post;
	selectedPosts: string[] | null;
	setSelectedPosts: React.Dispatch<React.SetStateAction<string[] | null>>
	setData: React.Dispatch<React.SetStateAction<PostsAPI | null>>;
}

function MasterGridRow({ data, post, selectedPosts, setSelectedPosts, setData }: MasterGridRowInterface) {
	async function handleRowClick() {
		if (post.modEntries === null) await fetchModEntriesData({ data, post, setData });

		if (selectedPosts === null) {
			setSelectedPosts([post.postId]);
		} else if (selectedPosts.includes(post.postId)) {
			setSelectedPosts(selectedPosts.filter(id => id !== post.postId));
		} else if (!selectedPosts.includes(post.postId)) {
			setSelectedPosts([...selectedPosts, post.postId]);
		} else {
			console.error("Something went wrong with the selectedPosts state...");
		}
	}

	return (
		<div className={selectedPosts === null ? "dg-row" :
			selectedPosts.includes(post.postId) ? "dg-row row-selected" : "dg-row"} onClick={handleRowClick}>
			<div className="dg-row-master">
				<div className="dg-cell">{post.title}</div>
				<div className="dg-cell">{post.author}</div>
				<div className="dg-cell">{post.flair}</div>
				<div className="dg-cell dg-center">{post.comments}</div>
				<div className="dg-cell dg-center">{post.score}</div>
				<div className="dg-cell">{post.timestamp}</div>
			</div>
			<div className="dg-row-detail">
				{selectedPosts === null ? "" :
					!selectedPosts?.includes(post.postId) ? "" :
						<DetailGrid entries={post.modEntries} />}
			</div>
		</div>
	)
}

interface DetailGridInterface {
	entries: ModEntriesAPI | null;
}

function DetailGrid({ entries: modEntries }: DetailGridInterface) {
	if (modEntries === null) return <LoadingIcon />;

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

export function MobileWarning() {
	return (
		<div className="mobile-warning">
			<p>Sorry, this page is not optimized for small displays.</p>
			<p>Please view this page on a desktop or laptop for optimal experience.</p>
		</div>
	)
}