import {ModLogEntry} from "../types/interfaces.ts";
import {Box, Link, useMediaQuery} from "@mui/material";
import {getUrlForModLogEntry} from "../util/util.ts";
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

export default function RedditLink({modLogEntry}: Readonly<{ modLogEntry: ModLogEntry }>) {
    const isTablet = useMediaQuery('(max-width:800px)');
    const url = getUrlForModLogEntry(modLogEntry);
    if (!url) {
        return <></>
    }

    return (<Box
        display="flex"
        height="100%"
        alignItems="center"
        justifyContent="center"
        marginX={isTablet ? "0.5rem" : "1rem"}>
        <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            display="flex"
            alignItems="center"
            color="inherit"
        >
            <OpenInNewOutlinedIcon fontSize={isTablet ? "small" : "medium"}/>
        </Link>
    </Box>)
}