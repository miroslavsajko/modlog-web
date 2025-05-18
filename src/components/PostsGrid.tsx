import {useEffect, useState} from "react";
import {Post, PostsAPIResponse} from "../types/interfaces.ts";
import {fetchPosts} from "../api/api.ts";
import {Paginator} from "./Paginator.tsx";
import {convertDateTime} from "../util/dateTimeConverter.ts";
import {ModEntriesGrid} from "./ModEntriesGrid.tsx";
import "../css/custom.scss";
import {LoadingIcon} from "./LoadingIcon.tsx";

const MAX_TITLE_LENGTH = 80;
const MAX_USERNAME_LENGTH = 20;

export function PostsGrid() {
    const [pageNum, setPageNum] = useState<number>(0);
    const [filterValue, setFilterValue] = useState<string>('');
    const [filterDebouncedValue, setFilterDebouncedValue] = useState<string>(filterValue)
    const [data, setData] = useState<PostsAPIResponse | null>(null);

    useEffect(() => {
        setData(null)
        fetchPosts({
            page: pageNum,
            filter: filterDebouncedValue
        }).then(setData)
            .catch((reason) => {
                console.error(reason)
            });
    }, [pageNum, filterDebouncedValue]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setFilterDebouncedValue(filterValue)
        }, 500)

        return () => {
            clearTimeout(handler)
        }
    }, [filterValue])

    return (<>
            <input type="text" placeholder="Filter by title, author or flair"  className='filter-input'
                   onChange={(e) => {
                const value = (e.target.value ?? '').trim();
                if (value.length < 3) {
                    setFilterValue('');
                } else {
                    setFilterValue(value);
                }
            }} />
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
                    {data === null ? <LoadingIcon /> : data.posts.map((post) => (
                        <PostsGridRow key={`postsgridrow-${post.postid}`} post={post} />
                    ))}
                </div>
            </div>
            <Paginator data={data} pageNum={pageNum} setPageNum={setPageNum} />
        </>
    )
}

interface MasterGridRowInterface {
    post: Post;
}

function PostsGridRow({ post }: MasterGridRowInterface) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    function handleRowClick() {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className={isExpanded ? "dg-row row-selected" : "dg-row"}>
            <div className="dg-row-master">
                <ExpandTriangle onClick={handleRowClick} isExpanded={isExpanded} />
                <div className="dg-cell">
                    <a className='post-link'
                       href={`https://www.reddit.com/r/Slovakia/comments/${post.postid}`}
                       target='_blank'>{truncateString(post.title, MAX_TITLE_LENGTH)}</a>
                </div>
                <div className="dg-cell dg-center">{truncateString(post.author, MAX_USERNAME_LENGTH)}</div>
                <div className="dg-cell dg-center">{post.flair}</div>
                <div className="dg-cell dg-center">{post.comments}</div>
                <div className="dg-cell dg-center">{post.score}</div>
                <div className="dg-cell dg-center">{convertDateTime(post.timestamp)}</div>
            </div>
            {isExpanded ? <div className="dg-row-detail">
                <ModEntriesGrid post={post} />
            </div> : <></>}
        </div>
    )
}

function ExpandTriangle({ isExpanded, onClick }: { isExpanded: boolean; onClick?: () => void }) {
    return (
        <div className={isExpanded ? "expand-triangle triangle-expanded" : "expand-triangle"}
             onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
        </div>
    )
}

function truncateString(str: string, maxLength: number): string {
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}