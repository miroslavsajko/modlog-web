import {ModLogEntry} from "../types/interfaces.ts";

export const getUrlForModLogEntry = (data: ModLogEntry) => {
    if (data.target) {
        return `https://www.reddit.com/user/${data.target}/`
    }
    if (data.postid && data.commentid) {
        return `https://www.reddit.com/r/hockey/comments/${data.postid}/comment/${data.commentid}/`
    }
    if (data.postid) {
        return getUrlForPost(data.postid)
    }
    return ''
}

export const getUrlForPost = (postId: string) => {
    return `https://www.reddit.com/r/hockey/comments/${postId}/`
}