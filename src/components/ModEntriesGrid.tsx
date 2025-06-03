import {ModEntry, Post} from "../types/interfaces.ts";
import {useEffect, useState} from "react";
import {fetchModEntriesForPost} from "../api/api.ts";
import {convertDateTime} from "../util/dateTimeConverter.ts";
import "../css/custom.scss";
import {LoadingIcon} from "./LoadingIcon.tsx";

interface MasterGridRowInterface {
    post: Post;
}

export function ModEntriesGrid({ post }: MasterGridRowInterface) {
    const [modEntries, setModEntries] = useState<ModEntry[] | null>(null);

    useEffect(() => {
        if(post === null) {
            return;
        }
        if(modEntries !== null) {
            return;
        }
        fetchModEntriesForPost(post.postid)
            .then((data) => setModEntries(data))
            .catch((reason)=> console.error(reason));
    }, [modEntries, post]);

    if (post === null) return <LoadingIcon />;

    return (
        <div className="dtg-wrapper">
            <div className="dtg-header">
                <div className="dtg-header-cell">Action</div>
                <div className="dtg-header-cell">Moderator</div>
                <div className="dtg-header-cell">Details</div>
                <div className="dtg-header-cell">Description</div>
                <div className="dtg-header-cell">Date</div>
            </div>

            <div className="dtg-body">
                {modEntries === null ? <LoadingIcon /> :
                    modEntries.map((entry) => (
                        <ModEntriesGridRow modEntry={entry} key={`modentrygrid-${entry.timestamp}`} />
                    ))}
            </div>
        </div>
    )
}


interface DetailGridRowInterface {
    modEntry: ModEntry;
}

function ModEntriesGridRow({ modEntry }: DetailGridRowInterface) {
    return (
        <div className="dtg-row">
            <div className="dtg-cell">{modEntry.action}</div>
            <div className="dtg-cell">{modEntry.mod}</div>
            <div className="dtg-cell">{modEntry.details}</div>
            <div className="dtg-cell">{modEntry.description}</div>
            <div className="dtg-cell">{convertDateTime(modEntry.timestamp)}</div>
        </div>
    )
}