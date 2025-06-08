import {Box, Dialog, DialogContent, DialogTitle, Typography, useMediaQuery} from "@mui/material";
import {ModEntry, ModLogEntry} from "../types/interfaces.ts";
import {DataGrid, DataGridProps, GridColDef} from "@mui/x-data-grid";
import {modActions, modlogDetails} from "../types/translations.ts";
import {convertDateTime} from "../util/dateTimeConverter.ts";
import {useCallback, useEffect, useMemo, useState} from "react";
import {fetchModEntriesForPost} from "../api/api.ts";

export default function ModlogEntriesDialog({postId, onCloseHandler}: Readonly<{
    postId: string | null,
    onCloseHandler: () => void
}>) {
    const isTablet = useMediaQuery('(max-width:800px)');
    const [fetchedModlogEntries, setFetchedModlogEntries] = useState<Record<string, ModEntry[] | null>>(
        {}
    );
    const data = useMemo(() => {
        if (postId === null) {
            return null;
        }
        return fetchedModlogEntries[postId];
    }, [fetchedModlogEntries, postId]);

    const fetchDialogModlogData = useCallback(async () => {
        if (postId === null) {
            return;
        }
        const modEntries = await fetchModEntriesForPost(postId);
        console.info('fetched')
        setFetchedModlogEntries(prevState => {
            return {
                ...prevState,
                [postId]: modEntries,
            };
        })
    }, [postId])

    useEffect(() => {
        fetchDialogModlogData()
    }, [fetchDialogModlogData]);

    let columns: GridColDef[]

    if (isTablet) {
        columns = [{
            field: 'modlogentryid',
            headerName: '',
            flex: 1,
            filterable: false,
            sortable: false,
            resizable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            renderCell: params => {
                const data: ModLogEntry = params.row;
                console.info(data)
                return (<Box display="flex" flexDirection="column" sx={{
                    height: '100%',
                    justifyContent: 'center',
                    whiteSpace: 'normal',
                }}>
                    <Typography variant="body1" sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                    }}>
                        <Typography component="span" fontWeight="bold">{data.mod}</Typography>
                        {' '}
                        <Typography component="span">{modActions[data.action] ?? data.action}</Typography>
                        {(data.target?.length ?? 0) > 0 ?
                            <Typography component="span" fontStyle="italic"> "{data.target}"</Typography> : <></>}

                    </Typography>
                    <Typography variant="caption" fontStyle="italic">
                        --author--
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {convertDateTime(data.timestamp)}
                    </Typography>
                </Box>)
            }
        }]
    } else {
        columns = [{
            field: 'mod',
            headerName: 'Mod',
            flex: 2,
            filterable: false,
            sortable: false,
        }, {
            field: 'action',
            headerName: 'Action',
            flex: 3,
            filterable: false,
            sortable: false,
            valueGetter: value => modActions[value] ?? value
        }, {
           field: 'author',
           headerName: 'Author',
           flex: 3,
           filterable: false,
           sortable: false,
           valueGetter: () => '--author--'
        }, {
            field: 'timestamp',
            headerName: 'Timestamp',
            flex: 3,
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            valueGetter: value => convertDateTime(value)
        }, {
            field: 'description',
            headerName: 'Details',
            flex: 4,
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (_value, row: ModLogEntry) => {
                const description = row.description;
                const details = modlogDetails[row.details] ?? row.details;
                let middle = ''
                if (description.length > 0 && details.length > 0) {
                    middle = ' - '
                }
                return `${description}${middle}${details}`;
            }
        }];
    }

    let pageSize = 10
    const tabletDataGridProps: DataGridProps = {
        columns: []
    }

    if (isTablet) {
        pageSize = 5
        tabletDataGridProps.getRowHeight = () => 'auto'
        tabletDataGridProps.sx = {'& .MuiDataGrid-columnSeparator': {display: 'none'}}
        tabletDataGridProps.columnHeaderHeight = 0
    }

    return <Dialog open={postId !== null}
                   onClose={onCloseHandler}
                   fullWidth
                   maxWidth="lg">
        <DialogTitle>Mod actions</DialogTitle>
        <DialogContent>
            <Box flex="1" minHeight="100">
                <DataGrid
                    {...tabletDataGridProps}
                    columns={columns}
                    rows={data ?? undefined}
                    getRowId={(row: ModEntry) => row.timestamp}
                    loading={!data}
                    paginationMode={'client'}
                    pageSizeOptions={[pageSize]}
                    paginationModel={{page: 0, pageSize: pageSize}}
                />
            </Box>
        </DialogContent>
    </Dialog>
}
