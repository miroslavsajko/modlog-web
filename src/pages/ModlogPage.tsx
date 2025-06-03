import {useCallback, useEffect, useMemo, useState} from 'react';
import {TextField, Box, debounce, useMediaQuery} from '@mui/material';
import {
    DataGrid,
    GridColDef, GridPaginationModel,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import {fetchModEntries} from "../api/api.ts";
import { ModLogEntry} from "../types/interfaces.ts";
import {convertDateTime} from "../util/dateTimeConverter.ts";

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

    // action: string;
    // mod: string;
    // details: string;
    // description: string;
    if (isMobile) {
        columns = [
            {
                field: 'mod',
                headerName: 'Mod',
                flex: 2,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center'
            },{
                field: 'action',
                headerName: 'Action',
                flex: 6,
                filterable: false,
                sortable: false
            },
            ]
    } else {
        columns = [
            {
                field: 'mod',
                headerName: 'Mod',
                flex: 2,
                filterable: false,
                sortable: false,
            },{
                field: 'action',
                headerName: 'Action',
                flex: 2,
                filterable: false,
                sortable: false
            },
            {
                field: 'details',
                headerName: 'Details',
                flex: 2,
                filterable: false,
                sortable: false,
                align: 'center',
                headerAlign: 'center'
            },{
                field: 'description',
                headerName: 'Desc',
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
        ];
    }


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
