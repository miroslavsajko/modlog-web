import {Box, Dialog, DialogContent, DialogTitle, Typography, useMediaQuery} from "@mui/material";
import {ModLogEntry} from "../types/interfaces.ts";
import {DataGrid, DataGridProps, GridColDef, GridPaginationModel} from "@mui/x-data-grid";
import {getModActionLabel, modlogDetails} from "../types/translations.ts";
import {convertDateTime} from "../util/dateTimeConverter.ts";
import {useCallback, useEffect, useMemo, useState} from "react";
import {fetchModEntriesForPost} from "../api/api.ts";

export default function ModlogEntriesDialog({postId, onCloseHandler}: Readonly<{
    postId: string | null,
    onCloseHandler: () => void
}>) {
    const isTablet = useMediaQuery('(max-width:800px)');
    const [fetchedModlogEntries, setFetchedModlogEntries] = useState<Record<string, ModLogEntry[] | null>>(
        {}
    );
    const defaultPagination = useMemo(() => {
        return {page: 0, pageSize: isTablet ? 5 : 10}
    }, [isTablet]);
    const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);

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
        setPagination(defaultPagination)
        setFetchedModlogEntries(prevState => {
            return {
                ...prevState,
                [postId]: modEntries,
            };
        })
    }, [defaultPagination, postId])

    useEffect(() => {
        fetchDialogModlogData()
    }, [fetchDialogModlogData]);

    const columns: GridColDef[] = useMemo(() => {
        if (isTablet) {
            return [{
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
                            <Typography component="span">{getModActionLabel(data.action)}</Typography>
                        </Typography>
                        <Typography variant="caption" fontStyle="italic">
                            {data.target ?? data.author ?? ''}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {convertDateTime(data.timestamp)}
                        </Typography>
                    </Box>)
                }
            }]
        } else {
            return [{
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
                valueGetter: value => getModActionLabel(value)
            }, {
                field: 'author',
                headerName: 'Author',
                flex: 3,
                filterable: false,
                sortable: false,
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
    }, [isTablet]);

    const grid = useMemo(() => {
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
        return (<DataGrid
            {...tabletDataGridProps}
            columns={columns}
            rows={data ?? undefined}
            getRowId={(row: ModLogEntry) => row.modentryid}
            loading={!data}
            paginationMode={'client'}
            pageSizeOptions={[pageSize]}
            paginationModel={pagination}
            onPaginationModelChange={setPagination}
            disableRowSelectionOnClick
        />);
    }, [columns, data, isTablet, pagination]);

    return <Dialog open={postId !== null}
                   onClose={onCloseHandler}
                   fullWidth
                   maxWidth="lg">
        <DialogTitle>Mod actions</DialogTitle>
        <DialogContent>
            <Box flex="1" minHeight="100">
                {grid}
            </Box>
        </DialogContent>
    </Dialog>
}
