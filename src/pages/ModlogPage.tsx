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
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const defaultPagination: GridPaginationModel = {page: 0, pageSize: 20};

export default function ModlogPage() {
    const [rows, setRows] = useState<ModLogEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('')
    const [filter, setFilter] = useState<string>('');
    const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
    const [rowCount, setRowCount] = useState<number>(0);
    const isTablet = useMediaQuery('(max-width:800px)');

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
                    </Typography>
                    <Typography variant="caption" fontStyle="italic">
                        {data.target ?? '--author--'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" >
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
        columns = [{
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
            valueGetter: (value, row:ModLogEntry) => {
                const values = [modActions[value] ?? value, row.target];
                return values.filter(a => a).join(' ')
            }
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
                const values = [description, details]
                return values.filter(a => a).join(' - ')
            }
        }, {
            field: 'details',
            headerName: 'More',
            width: 60,
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            resizable: false,
            disableColumnMenu: true,
            renderCell: params => {
                const data: ModLogEntry = params.row;
                if (data.postid) {
                    return (<Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Link
                            gap={4}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'inherit'
                            }}
                            onClick={() => {
                                // TODO
                            }}
                        >
                            <SearchOutlinedIcon fontSize="small"/>
                        </Link>
                    </Box>)
                } else {
                    return <></>
                }
            }
        }, {
            field: 'link',
            headerName: 'Link',
            width: 60,
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
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
                    >
                        <Link
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            gap={4}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'inherit'
                            }}
                        >
                            <OpenInNewOutlinedIcon fontSize="small"/>
                        </Link>
                    </Box>)
                } else {
                    return <></>
                }
            }
        }];
    }

    const targetDataGridProps: DataGridProps = {
        columns: []
    }

    if (isTablet) {
        targetDataGridProps.getRowHeight = () => 'auto'
        targetDataGridProps.sx = {'& .MuiDataGrid-columnSeparator': {display: 'none'}}
        targetDataGridProps.columnHeaderHeight = 0
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
                {...targetDataGridProps}
                rows={rows}
                getRowId={(row: ModLogEntry) => row.modentryid}
                columns={columns}
                rowCount={rowCount}
                paginationMode="server"
                paginationModel={pagination}
                onPaginationModelChange={setPagination}
                loading={loading}
                pageSizeOptions={[10, 20, 40]}
            />
        </Box>
    );
}
