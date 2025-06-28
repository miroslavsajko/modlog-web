import {ModLogEntry} from "../types/interfaces.ts";
import {Box, Typography, useMediaQuery} from "@mui/material";
import RedditLink from "./RedditLink.tsx";

export default function ModLogBody({modLogEntry}: Readonly<{ modLogEntry: ModLogEntry }>) {
    const isTablet = useMediaQuery('(max-width:800px)');

    return  <Box display="flex" flexDirection="row">
        <Box display="flex" flexDirection="column" overflow="hidden"
             whiteSpace="nowrap" textOverflow="ellipsis" width="100%">
            {modLogEntry.type === 'POST' ?
                <Typography variant={isTablet ? 'caption' : 'body1'} component="span"
                            alignContent="center" marginX="1rem" marginY="0.5rem">
                    {modLogEntry.flair}
                </Typography> : <></>}
            <Typography variant="body1" component="span" overflow="hidden"
                        whiteSpace="nowrap" textOverflow="ellipsis" width="100%"  marginBottom="0.25rem"
            >
                {getCellContentLabel(modLogEntry)}
            </Typography>
        </Box>
        <RedditLink modLogEntry={modLogEntry}/>
    </Box>
}

const getCellContentLabel = (rowData: ModLogEntry) => {
    if (rowData.commentid) {
        let body = rowData.body;
        if (body?.length === 100) {
            body += '...'
        }
        return body;
    }
    if (rowData.postid) {
        return rowData.title;
    }
    return null
}