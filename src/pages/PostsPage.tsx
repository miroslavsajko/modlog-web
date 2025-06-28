import {useCallback, useEffect, useMemo, useState} from 'react';
import {
    TextField,
    Box,
    debounce,
    Link,
    useMediaQuery,
    Typography,
} from '@mui/material';
import {
    DataGrid, DataGridProps,
    GridColDef, GridPaginationModel,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import {fetchPosts} from "../api/api.ts";
import {Post} from "../types/interfaces.ts";
import {convertDateTime} from "../util/dateTimeConverter.ts";
import {getUrlForPost} from "../util/util.ts";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ModlogEntriesDialog from "../components/ModlogEntriesDialog.tsx";

const defaultPagination: GridPaginationModel = {page: 0, pageSize: 20};

export default function PostsPage() {
    const [rows, setRows] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('')
    const [filter, setFilter] = useState<string>('');
    const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
    const [rowCount, setRowCount] = useState<number>(0);
    const isTablet = useMediaQuery('(max-width:800px)');
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const handleClose = () => setSelectedPostId(null);

    const fetchGridPostData = useCallback(async () => {
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
        fetchGridPostData()
    }, [fetchGridPostData]);

    const columns = useMemo(() => {
        if (isTablet) {
            return [{
                field: 'title',
                headerName: 'Name',
                flex: 6,
                filterable: false,
                sortable: false,
                resizable: false,
                disableColumnMenu: true,
                renderCell: (params: GridRenderCellParams) => {
                    const data: Post = params.row;
                    return <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                            height: '100%',
                            justifyContent: 'center',
                            width: '100%', maxWidth: '100%',
                            overflow: 'hidden',
                            overflowWrap: 'break-word',
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            noWrap
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%'
                            }}
                        >
                            {data.title}
                        </Typography>
                        <Typography variant="caption" fontStyle="italic">
                            {data.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {convertDateTime(data.timestamp)}
                        </Typography>
                    </Box>

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
                    const data: Post = params.row;
                    const url = getUrlForPost(data.postid);
                    if (url) {
                        return (<Box
                            paddingX={'2px'}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Link
                                marginRight={'8px'}
                                gap={4}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'inherit'
                                }}
                                onClick={() => {
                                    setSelectedPostId(data.postid)
                                }}
                            >
                                <SearchOutlinedIcon fontSize="small"/>
                            </Link>
                            <Link
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                marginRight={'4px'}
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
            }] as GridColDef[]
        } else {
           return [{
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
                        const data: Post = params.row;
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
                                    color: 'inherit',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setSelectedPostId(data.postid)
                                }}
                            >
                                <SearchOutlinedIcon fontSize="small"/>
                            </Link>
                        </Box>)
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
                        const data: Post = params.row;
                        const url = getUrlForPost(data.postid);
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
                }] as GridColDef[] ;
        }
    }, [isTablet]);

    const dialog = useMemo(() => {
        return <ModlogEntriesDialog postId={selectedPostId} onCloseHandler={handleClose}/>
    }, [selectedPostId]);

    const grid = useMemo(() => {
        const tabletDataGridProps: DataGridProps = {
            columns: []
        }

        if (isTablet) {
            tabletDataGridProps.getRowHeight = () => 'auto'
            tabletDataGridProps.sx = {'& .MuiDataGrid-columnSeparator': {display: 'none'}}
            tabletDataGridProps.columnHeaderHeight = 0
        }
        return <DataGrid
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
            disableRowSelectionOnClick
        />
    }, [columns, isTablet, loading, pagination, rowCount, rows]);

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
            {grid}
            {dialog}
        </Box>
    );
}
