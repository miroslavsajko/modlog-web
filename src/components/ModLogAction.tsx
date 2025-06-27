import {ModLogEntry} from "../types/interfaces.ts";
import {Box, Typography, useMediaQuery} from "@mui/material";
import {getModActionCategoryColor, getModActionDetailLabel, getModActionLabel} from "../types/translations.ts";
import {useMemo} from "react";

export default function ModLogAction({modLogEntry}: Readonly<{ modLogEntry: ModLogEntry }>) {
    const isTablet = useMediaQuery('(max-width:800px)');

    const modActionDetail = useMemo(() => {
        const modActionDetailLabel = getModActionDetailLabel(modLogEntry.details, modLogEntry.description);

        let details = undefined;
        if (modActionDetailLabel) {
            details = (<>
                {': '}
                {isTablet ? <br/> : <></>}
                {modActionDetailLabel}
            </>)
        }

        return <Typography variant="body2"
                           component="span">
            {getModActionLabel(modLogEntry.action)}
            {details ?? <></>}
        </Typography>

    }, [isTablet, modLogEntry]);

    return (<Box overflow="hidden" whiteSpace="nowrap"
                 textOverflow="ellipsis" width="100%"
                 paddingX="0.75rem"
                 paddingY="0.25rem"
                 marginY="0.5rem"
                 sx={{
                     backgroundColor: getModActionCategoryColor(modLogEntry.action),
                     borderRadius: '0.5rem'
                 }}
    >
        <Typography variant="body2" component="span" fontWeight="bold" marginRight={'0.25rem'}>
            {modLogEntry.mod}
        </Typography>
        {modActionDetail}
    </Box>)
}