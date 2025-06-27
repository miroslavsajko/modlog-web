import {ModLogEntry} from "../types/interfaces.ts";
import {Box, Link} from "@mui/material";
import {getUrlForModLogEntry} from "../util/util.ts";
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

export default function RedditLink({modLogEntry}: Readonly<{ modLogEntry: ModLogEntry }>) {
    const url = getUrlForModLogEntry(modLogEntry);
    if (!url) {
        return <></>
    }

    return (<Box
        sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
        <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: 'inherit',
            }}
        >
            <OpenInNewOutlinedIcon fontSize="small"/>
        </Link>
    </Box>)
}