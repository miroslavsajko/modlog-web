import {useCallback, useEffect, useMemo, useState} from 'react';
import {TextField, Box, debounce} from '@mui/material';
import {
    DataGrid, GridPaginationModel,
} from '@mui/x-data-grid';
import {fetchModEntries} from "../api/api.ts";
import {ModLogEntry} from "../types/interfaces.ts";
import ModLogGridCell from "../components/ModLogGridCell.tsx";

const defaultPagination: GridPaginationModel = {page: 0, pageSize: 20};

export default function ModlogPage() {
    const [rows, setRows] = useState<ModLogEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('')
    const [filter, setFilter] = useState<string>('');
    const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
    const [rowCount, setRowCount] = useState<number>(0);

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
                        <ModLogGridCell modLogEntry={row}/>
                }]}
                rowCount={rowCount}
                getRowHeight={() => 'auto'}
                sx={{
                    '& .MuiDataGrid-columnSeparator': {display: 'none'},
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
