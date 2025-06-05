import {useCallback, useEffect, useMemo, useState} from 'react';
import {TextField, Box, Link, debounce, useMediaQuery, Typography} from '@mui/material';
import {
    DataGrid, DataGridProps,
    GridColDef, GridPaginationModel,
} from '@mui/x-data-grid';
import {fetchModEntries} from "../api/api.ts";
import {ModLogEntry} from "../types/interfaces.ts";
import {convertDateTime} from "../util/dateTimeConverter.ts";
import {modActions, modlogDetails} from "../types/translations.ts";

const defaultPagination: GridPaginationModel = {page: 0, pageSize: 20};

export default function ModlogPage() {
    const [rows, setRows] = useState<ModLogEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('')
    const [filter, setFilter] = useState<string>('');
    const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
    const [rowCount, setRowCount] = useState<number>(0);
    const isMobile = useMediaQuery('(max-width:800px)');

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await fetchModEntries({
            page: pagination.page,
            pageSize: pagination.pageSize,
            filter: filter
        })
        setRowCount(data.page.totalElements);
        setRows(data.posts);
        setLoading(false);
    }, [filter, pagination]);

    const debouncedSetFilter = useMemo(
        () =>
            debounce((value: string) => {
                setFilter(value);
                setPagination(defaultPagination);
            }, 500),
        []);

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        debouncedSetFilter(value);
    };

    useEffect(() => {
        fetchData()
    }, [fetchData, filter, pagination]);

    let columns: GridColDef[] = []

    if (isMobile) {
        columns = [
            {
                field: 'mod',
                headerName: '',
                flex: 1,
                filterable: false,
                sortable: false,
                disableColumnMenu: true,
                headerAlign: 'center',
                renderCell: params => {
                    const data: ModLogEntry = params.row;
                    return (<Box display="flex" flexDirection="column">
                        <Typography variant="body1" flex="1">
                            <Typography component="span" fontWeight="bold">{data.mod}</Typography>
                            {' '}
                            <Typography component="span">{modActions[data.action] ?? data.action}</Typography>
                            {(data.target?.length ?? 0) > 0 ?
                                <Typography component="span" fontStyle="italic"> "{data.target}"</Typography> : <></>}
                        </Typography>
                        {data.description.length > 0 ? <Typography variant="subtitle1">
                            <Typography component="span" fontStyle="italic" fontSize="smaller"
                                        lineHeight="1">{data.description}</Typography>
                        </Typography> : <></>}
                        <Typography variant="caption" color="text.secondary">
                            {convertDateTime(data.timestamp)}
                        </Typography>
                    </Box>)
                }
            }]
    } else {
        columns = [
            {
                field: 'mod',
                headerName: 'Mod',
                flex: 1,
                filterable: false,
                sortable: false,
            }, {
                field: 'action',
                headerName: 'Action',
                flex: 1,
                filterable: false,
                sortable: false,
                valueGetter: value => modActions[value] ?? value
            }, {
                field: 'timestamp',
                headerName: 'Timestamp',
                flex: 1,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                valueGetter: value => convertDateTime(value)
            }, {
                field: 'description',
                headerName: 'Details',
                flex: 2,
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
            },  {
                field: 'target',
                headerName: 'Link',
                flex: 1,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                renderCell: params => {
                    if (params.value) {
                        return (<Link href={`https://www.reddit.com/user/${params.value}/`}
                                      target="_blank">{params.value}</Link>)
                    }
                    const data: ModLogEntry = params.row;
                    if (data.postid && data.commentid) {
                        return (<Link
                            href={`https://www.reddit.com/r/hockey/comments/${data.postid}/comment/${data.commentid}/`}
                            target="_blank">Comment Link</Link>)
                    }
                    if (data.postid) {
                        return (<Link href={`https://www.reddit.com/r/hockey/comments/${data.postid}/`}
                                      target="_blank">Post Link</Link>)
                    }
                    return ''
                }
            },
        ];
    }

    const mobileDataGridProps: DataGridProps = {
        columns: []
    }

    if (isMobile) {
        mobileDataGridProps.rowHeight = 75
        mobileDataGridProps.columnHeaderHeight = 1
    }

    return (
        <Box sx={{padding: 2}}>
            <TextField
                label="Filter"
                placeholder="Filter by mod, action or reason"
                variant="outlined"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                fullWidth
                sx={{mb: 2}}
            />
            <DataGrid
                {...mobileDataGridProps}
                rows={rows}
                getRowId={(row: ModLogEntry) => row.modlogentryid}
                columns={columns}
                rowCount={rowCount}
                paginationMode="server"
                paginationModel={pagination}
                onPaginationModelChange={setPagination}
                loading={loading}
                pageSizeOptions={[10, 20, 50]}
            />
        </Box>
    );
}
