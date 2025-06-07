import {useCallback, useEffect, useMemo, useState} from 'react';
import {TextField, Box, debounce, Link, useMediaQuery, Typography} from '@mui/material';
import {
    DataGrid, DataGridProps,
    GridColDef, GridPaginationModel,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import {fetchPosts} from "../api/api.ts";
import {ModLogEntry, Post} from "../types/interfaces.ts";
import {convertDateTime} from "../util/dateTimeConverter.ts";
import {getUrlForModLogEntry} from "../util/util.ts";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

const defaultPagination: GridPaginationModel = {page: 0, pageSize: 20};

export default function PostsPage() {
    const [rows, setRows] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('')
    const [filter, setFilter] = useState<string>('');
    const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
    const [rowCount, setRowCount] = useState<number>(0);
    const isTablet = useMediaQuery('(max-width:800px)');

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await fetchPosts({
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
    }, [fetchData]);

    let columns: GridColDef[] = []

    if (isTablet) {
        columns = [{
            field: 'title',
            headerName: 'Name',
            flex: 6,
            filterable: false,
            sortable: false,
            resizable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams) => {
                console.info(params.row)
                const data: Post = params.row;
                return (<Box display="flex" flexDirection="column" sx={{
                    height: '100%',
                    justifyContent: 'center',
                    whiteSpace: 'normal',
                }}>
                    <Typography variant="body1" component="span"
                                fontWeight="bold"
                                sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        // width: '100%',
                    }}>
                        {data.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="span" >
                        {'at '}
                        <Typography  variant="caption" fontWeight="bold">
                            {convertDateTime(data.timestamp)}
                        </Typography>
                        {' by '}
                        <Typography component="span"   variant="caption" fontWeight="bold">
                            {data.author}
                        </Typography>
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
            field: 'title',
            headerName: 'Name',
            flex: 6,
            filterable: false,
            sortable: false,
        },
            {
                field: 'author',
                headerName: 'Author',
                flex: 2,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center'
            },
            {
                field: 'flair',
                headerName: 'Flair',
                flex: 2,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center'
            },
            {
                field: 'timestamp',
                headerName: 'Timestamp',
                flex: 2,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                valueGetter: (value) => (
                    convertDateTime(value)
                )
            },
            {
                field: 'score',
                headerName: 'Score',
                flex: 1,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center'
            },
            {
                field: 'comments',
                headerName: 'Comments',
                flex: 1,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center'
            }, {
                field: 'postid',
                headerName: 'Link',
                flex: 1,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) =>
                    (<Link href={`https://www.reddit.com/r/Slovakia/comments/${params.row.postid}/`}
                           target="_blank">Link</Link>)
            }];
    }

    const tabletDataGridProps: DataGridProps = {
        columns: []
    }

    if (isTablet) {
        tabletDataGridProps.getRowHeight = () => 'auto'
        tabletDataGridProps.sx = {'& .MuiDataGrid-columnSeparator': {display: 'none'}}
        tabletDataGridProps.columnHeaderHeight = 0
    }

    return (
        <Box>
            <TextField
                label="Filter"
                placeholder="Filter by title, author or flair"
                variant="outlined"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                fullWidth
                sx={{mb: 2}}
            />
            <DataGrid
                {...tabletDataGridProps}
                rows={rows}
                getRowId={(row: Post) => row.postid}
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
