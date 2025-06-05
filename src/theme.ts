// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
    },
    components: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e1e1e',
                    color: '#fff',
                },
                columnHeaders: {
                    backgroundColor: '#2c2c2c',
                    color: '#ffffff',
                },
                row: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#252525',
                    },
                    '&:nth-of-type(even)': {
                        backgroundColor: '#1e1e1e',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1f1f1f',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                },
            },
        },
    },
});
