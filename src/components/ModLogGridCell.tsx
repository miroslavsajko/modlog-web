import {Box, Typography, useMediaQuery} from "@mui/material";
import {convertDateTime} from "../util/dateTimeConverter.ts";
import {ModLogEntry} from "../types/interfaces.ts";
import ModLogAction from "./ModLogAction.tsx";
import RedditLink from "./RedditLink.tsx";

export default function ModLogGridCell({modLogEntry}: Readonly<{ modLogEntry: ModLogEntry }>) {
    const isTablet = useMediaQuery('(max-width:800px)');

    return <Box display="flex" flexDirection="column" justifyContent="center"
                whiteSpace="normal" height="100%" padding="0.25rem"
    >
        <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Typography variant="caption">
                {getCellHeaderLabel(modLogEntry)}
            </Typography>
            <Typography variant="caption" overflow="clip">
                {convertDateTime(modLogEntry.timestamp)}
            </Typography>
        </Box>

        <Box display="flex" flexDirection="row">
            <Box display="flex" flexDirection={isTablet ? "column" : "row"} overflow="hidden"
                 whiteSpace="nowrap" textOverflow="ellipsis" width="100%">
                {modLogEntry.type === 'POST' ?
                    <Typography variant={isTablet ? 'caption' : 'body1'} component="span"
                                alignContent="center" marginX="0.25rem">
                        {modLogEntry.flair}
                    </Typography> : <></>}
                <Typography variant="body1" component="span" overflow="hidden"
                            whiteSpace="nowrap" textOverflow="ellipsis" width="100%"
                >
                    {getCellContentLabel(modLogEntry)}
                </Typography>
            </Box>
            <RedditLink modLogEntry={modLogEntry}/>
        </Box>

        <ModLogAction modLogEntry={modLogEntry} />
    </Box>
}

const getCellHeaderLabel = (rowData: ModLogEntry) => {
    if (rowData.author && rowData.author.length > 0) {
        return '/u/' + rowData.author
    }
    if (rowData.target && rowData.target.length > 0) {
        return '/u/' + rowData.target
    }
    return '/r/Slovakia'
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