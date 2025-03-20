import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
import MasterDetail from './MasterDetail.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		{/* <App /> */}
		<MasterDetail/>
	</StrictMode>,
)
