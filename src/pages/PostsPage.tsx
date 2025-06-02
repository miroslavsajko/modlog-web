import {useCallback, useEffect, useMemo, useState} from 'react';
import {TextField, Box, debounce, Link} from '@mui/material';
import {
    DataGrid,
    GridColDef, GridPaginationModel,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import {fetchPosts} from "../api/api.ts";
import {Post} from "../types/interfaces.ts";
import {convertDateTime} from "../util/dateTimeConverter.ts";

const defaultPagination: GridPaginationModel = {page: 0, pageSize: 20};

export default function PostsPage() {
    const [rows, setRows] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('')
    const [filter, setFilter] = useState<string>('');
    const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
    const [rowCount, setRowCount] = useState<number>(0);

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
    }, [fetchData, filter, pagination]);

    const columns: GridColDef[] = [
        {
            field: 'title',
            headerName: 'Name',
            flex: 6,
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams) =>
                (<Link href={`https://www.reddit.com/r/Slovakia/comments/${params.row.postid}/`}
                       target="_blank">{params.value}</Link>)
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
            renderCell: (params: GridRenderCellParams) => (
                convertDateTime(params.value)
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
        },
    ];

    return (
        <Box sx={{height: 500, padding: 2}}>
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
                rows={rows}
                getRowId={(row: Post) => row.postid}
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
