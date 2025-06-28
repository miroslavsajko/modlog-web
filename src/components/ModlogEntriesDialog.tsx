import {Box, Dialog, DialogContent, useMediaQuery} from "@mui/material";
import {ModLogEntry, Post} from "../types/interfaces.ts";
import {useCallback, useEffect, useMemo, useState} from "react";
import {fetchModEntriesForPost} from "../api/api.ts";
import ModLogAction from "./ModLogAction.tsx";
import ModLogBody from "./ModLogBody.tsx";
import ModLogHeader from "./ModLogHeader.tsx";

export default function ModlogEntriesDialog({post, onCloseHandler}: Readonly<{
    post: Post | null,
    onCloseHandler: () => void
}>) {
    const isTablet = useMediaQuery('(max-width:800px)');
    const [fetchedModlogEntries, setFetchedModlogEntries] = useState<Record<string, ModLogEntry[] | null>>(
        {}
    );

    const data = useMemo(() => {
        if (post === null) {
            return null;
        }
        return fetchedModlogEntries[post.postid];
    }, [fetchedModlogEntries, post]);

    const fetchDialogModlogData = useCallback(async () => {
        if (post === null) {
            return;
        }
        const modEntries = await fetchModEntriesForPost(post.postid);
        setFetchedModlogEntries(prevState => {
            return {
                ...prevState,
                [post.postid]: modEntries,
            };
        })
    }, [post])

    useEffect(() => {
        fetchDialogModlogData()
    }, [fetchDialogModlogData]);

    const dialogBody = useMemo(() => {
        if (!post) {
            return <></>
        }

        let modLogActions = <></>

        if (data) {
            modLogActions = <>{
                data.map(modLogEntry => {
                    return <ModLogAction key={'action-' + modLogEntry.modentryid} modLogEntry={modLogEntry}
                                         showTimestamp/>
                })
            }</>
        }

        const modLogEntry: ModLogEntry = {
            modentryid: "",
            action: "",
            mod: "",
            details: "",
            description: "",
            commentid: "",
            type: "POST",
            ...post
        };
        return <Box display="flex" flexDirection="column" justifyContent="center"
                    whiteSpace="normal" height="100%" padding="0.25rem"
        >
            <ModLogHeader modLogEntry={modLogEntry}/>
            <ModLogBody modLogEntry={modLogEntry}/>
            {modLogActions}
        </Box>
    }, [post, data]);


    return <Dialog open={post !== null}
                   onClose={onCloseHandler}
                   fullWidth
                   maxWidth="lg">
        <DialogContent sx={isTablet ? {
            padding: '0.75rem 0.75rem'
        } : {}}>
            <Box flex="1" minHeight="100" bgcolor='#121212' padding={isTablet ? '0.5rem' : '1rem'}>
                {dialogBody}
            </Box>
        </DialogContent>
    </Dialog>
}
