import {ModLogEntry} from "../types/interfaces.ts";
import {Box, Typography, useMediaQuery} from "@mui/material";
import {getModActionCategoryColor, getModActionDetailLabel, getModActionLabel} from "../types/translations.ts";
import {useMemo} from "react";
import {convertDateTime} from "../util/dateTimeConverter.ts";

export default function ModLogAction({modLogEntry, showTimestamp = false}: Readonly<{
    modLogEntry: ModLogEntry,
    showTimestamp?: boolean
}>) {
    const isTablet = useMediaQuery('(max-width:800px)');

    const modActionDetail = useMemo(() => {
        const modActionDetailLabel = getModActionDetailLabel(modLogEntry.details, modLogEntry.description);

        let details = <></>;
        if (modActionDetailLabel) {
            details = (<>
                {': '}
                {isTablet ? <br/> : <></>}
                {modActionDetailLabel}
            </>)
        }

        return <>
            {getModActionLabel(modLogEntry.action)}
            {details}
        </>
    }, [isTablet, modLogEntry]);

    return (<Box width="100%"
                 paddingX="0.75rem"
                 paddingY="0.25rem"
                 marginY="0.5rem"
                 display="flex"
                 flexDirection={isTablet ? 'column' : 'row'}
                 justifyContent="space-between"
                 sx={{
                     backgroundColor: getModActionCategoryColor(modLogEntry.action),
                     borderRadius: '0.5rem'
                 }}
    >
        <Typography variant="body2" component="span" >
            <b>{modLogEntry.mod}</b> {modActionDetail}
        </Typography>

        {showTimestamp ?
            <Typography variant="caption" component="span" >
                {convertDateTime(modLogEntry.timestamp)}
            </Typography>
            : <></>
        }
    </Box>)
}