import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>,
)
