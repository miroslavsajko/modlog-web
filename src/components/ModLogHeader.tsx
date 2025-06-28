import {ModLogEntry} from "../types/interfaces.ts";
import {Box, Typography} from "@mui/material";
import {convertDateTime} from "../util/dateTimeConverter.ts";

export default function ModLogHeader({modLogEntry}: Readonly<{ modLogEntry: ModLogEntry }>) {

    return <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="caption">
            {getCellHeaderLabel(modLogEntry)}
        </Typography>
        <Typography variant="caption" overflow="clip">
            {convertDateTime(modLogEntry.timestamp)}
        </Typography>
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