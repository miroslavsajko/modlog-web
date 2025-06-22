import {useCallback, useEffect, useMemo, useState} from 'react';
import {TextField, Box, Link, debounce,  Typography} from '@mui/material';
import {
    DataGrid, GridPaginationModel,
} from '@mui/x-data-grid';
import {fetchModEntries} from "../api/api.ts";
import {ModLogEntry} from "../types/interfaces.ts";
import {convertDateTime} from "../util/dateTimeConverter.ts";
import {
    getModActionCategoryColor,
    getModActionLabel,
} from "../types/translations.ts";
import {getUrlForModLogEntry} from "../util/util.ts";
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

const defaultPagination: GridPaginationModel = {page: 0, pageSize: 20};

const getCellContentText = (rowData: ModLogEntry) => {
    if (rowData.commentid) {
        let body = rowData.body;
        if (body?.length === 100) {
            body += '...'
        }
        return body;
    }
    if (rowData.postid) {
        return rowData.title;
    }
    if (rowData.target) {
        return rowData.target
    }
    if (rowData.description) {
        return rowData.description
    }
    if (rowData.details) {
        return rowData.details
    }
    return 'Unexpected content!'
}

export default function ModlogPage() {
    const [rows, setRows] = useState<ModLogEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('')
    const [filter, setFilter] = useState<string>('');
    const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
    const [rowCount, setRowCount] = useState<number>(0);
    // const isTablet = useMediaQuery('(max-width:800px)');

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await fetchModEntries({
            page: pagination.page,
            pageSize: pagination.pageSize,
            filter: filter
        })
        setRowCount(data.page.totalElements);
        setRows(data.entries);
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
                rows={rows}
                getRowId={(row: ModLogEntry) => row.modentryid}
                columns={[{
                    field: 'modlogentryid',
                    headerName: '',
                    flex: 1,
                    filterable: false,
                    sortable: false,
                    resizable: false,
                    disableColumnMenu: true,
                    headerAlign: 'center',
                    renderCell: ({row}) =>
                        <Box display="flex" flexDirection="column" justifyContent="center"
                             whiteSpace="normal" height="100%" padding="4px"
                        >
                            <Box display="flex" flexDirection="row" justifyContent="space-between">
                                <Typography variant="caption">
                                    {(row.author ? '/u/' + row.author : row.target ? '/u/' + row.target : '')}
                                </Typography>
                                <Typography variant="caption">
                                    {convertDateTime(row.timestamp)}
                                </Typography>
                            </Box>
                            {row.type === 'POST' ? <Typography variant="caption">
                                {row.flair}
                            </Typography> : <></>}
                            <Typography variant="body1" component="span" overflow="hidden"
                                        whiteSpace="nowrap" textOverflow="ellipsis" width="100%"
                            >
                                {getCellContentText(row)}
                            </Typography>

                            <Box overflow="hidden" whiteSpace="nowrap"
                                 textOverflow="ellipsis" width="100%"
                                 paddingX="0.75rem"
                                 paddingY="0.25rem"
                                 marginY="0.5rem"
                                 sx={{backgroundColor: getModActionCategoryColor(row.action),
                                     borderRadius: '0.5rem'}}
                            >
                                <Typography variant="body2" component="span" fontWeight="bold">{row.mod}</Typography>
                                {' '}
                                <Typography variant="body2"
                                            component="span">
                                    {getModActionLabel(row.action)}
                                </Typography>
                                {
                                    // TODO handle details and descriptions, rework getModActionDetailLabel
                                }
                            </Box>
                        </Box>
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
                }]}
                rowCount={rowCount}
                getRowHeight={() => 'auto'}
                sx={{
                    '& .MuiDataGrid-columnSeparator': {display: 'none'},
                    // '& .MuiDataGrid-row': {}
                }}
                columnHeaderHeight={0}
                paginationMode="server"
                paginationModel={pagination}
                onPaginationModelChange={setPagination}
                loading={loading}
                pageSizeOptions={[10, 20, 40]}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
