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
import {getUrlForModLogEntry} from "../util/util.ts";
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

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
                            <Typography component="span">{modActions[data.action] ?? data.action}</Typography>
                            {(data.target?.length ?? 0) > 0 ?
                                <Typography component="span" fontStyle="italic"> "{data.target}"</Typography> : <></>}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {convertDateTime(data.timestamp)}
                        </Typography>
                    </Box>)
                }
            }, {
                field: 'action',
                headerName: '',
                width: 20,
                filterable: false,
                sortable: false,
                align: 'center',
                resizable: false,
                disableColumnMenu: true,
                renderCell: params => {
                    const data: ModLogEntry = params.row;
                    const url = getUrlForModLogEntry(data);
                    if (url) {
                        return (<Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        ><Link
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
                        </Link></Box>)
                    } else {
                        return <></>
                    }
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
            }, {
                field: 'target',
                headerName: 'Link',
                flex: 1,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                renderCell: params => {
                    const data: ModLogEntry = params.row;
                    const url = getUrlForModLogEntry(data);
                    if (data.target) {
                        return (<Link href={url} target="_blank" rel="noopener noreferrer">{data.target}</Link>)
                    }
                    if (data.postid && data.commentid) {
                        return (<Link
                            href={url} target="_blank" rel="noopener noreferrer">Comment Link</Link>)
                    }
                    if (data.postid) {
                        return (<Link href={url} target="_blank" rel="noopener noreferrer">Post Link</Link>)
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
        mobileDataGridProps.getRowHeight = () => 'auto'
        mobileDataGridProps.sx = {'& .MuiDataGrid-columnSeparator': {display: 'none'}}
        mobileDataGridProps.columnHeaderHeight = 0
    }

    return (
        <Box>
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
