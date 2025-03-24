import "../css/datagrid.scss";
import { fetchModEntriesData } from "./api";
import { ModEntry, Post, PostsAPI } from "./interfaces";

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
				<div className="dg-header-cell"></div>
				<div className="dg-header-cell">Title</div>
				<div className="dg-header-cell dg-center">Author</div>
				<div className="dg-header-cell dg-center">Flair</div>
				<div className="dg-header-cell dg-center">Comments</div>
				<div className="dg-header-cell dg-center">Upvotes</div>
				<div className="dg-header-cell dg-center">Date</div>
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
			selectedPosts.includes(post.postId) ? "dg-row row-selected" : "dg-row"}>
			<div className="dg-row-master">
				<ExpandTriangle onClick={handleRowClick} isOpen={selectedPosts === null ? false :
					selectedPosts.includes(post.postId)} />
				<div className="dg-cell">
					<a className='post-link'
						href={`https://www.reddit.com/r/Slovakia/comments/${post.postId}`}
						target='_blank'>{post.title}</a>
				</div>
				<div className="dg-cell dg-center">{post.author}</div>
				<div className="dg-cell dg-center">{post.flair}</div>
				<div className="dg-cell dg-center">{post.comments}</div>
				<div className="dg-cell dg-center">{post.score}</div>
				<div className="dg-cell dg-center">{post.timestamp}</div>
			</div>
			<div className="dg-row-detail">
				{selectedPosts === null ? "" :
					!selectedPosts?.includes(post.postId) ? "" :
						<DetailGrid post={post} />}
			</div>
		</div>
	)
}

interface DetailGridInterface {
	post: Post | null;
}

function DetailGrid({ post }: DetailGridInterface) {
	if (post === null) return <LoadingIcon />;

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
				{post.modEntries === null ? <LoadingIcon /> :
					post.modEntries._embedded.modentries.map((entry, idx) => (
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

function ExpandTriangle({ isOpen, onClick }: { isOpen: boolean; onClick?: () => void }) {
	return (
		<div className={isOpen ? "expand-triangle triangle-expanded" : "expand-triangle"}
			onClick={onClick}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
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