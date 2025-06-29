import {Box} from "@mui/material";
import {ModLogEntry} from "../types/interfaces.ts";
import ModLogAction from "./ModLogAction.tsx";
import ModLogHeader from "./ModLogHeader.tsx";
import ModLogBody from "./ModLogBody.tsx";

export default function ModLogGridCell({modLogEntry}: Readonly<{ modLogEntry: ModLogEntry }>) {

    return <Box display="flex" flexDirection="column" justifyContent="center"
                whiteSpace="normal" height="100%" padding="0.25rem"
    >
        <ModLogHeader modLogEntry={modLogEntry}/>
        <ModLogBody modLogEntry={modLogEntry}/>
        <ModLogAction modLogEntry={modLogEntry}/>
    </Box>
}

