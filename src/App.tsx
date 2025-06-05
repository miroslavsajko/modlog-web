import {Route, Routes} from "react-router-dom";
import PostsPage from "./pages/PostsPage.tsx";
import ChartPage from "./pages/ChartPage.tsx";
import ModlogPage from "./pages/ModlogPage.tsx";
import Layout from "./pages/Layout.tsx";
// import "./App.scss"

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout/>} >
				<Route index element={<ModlogPage />}/>
				<Route path="/modlog-posts" element={<PostsPage />} />
				<Route path="/charts" element={<ChartPage />} />
			</Route>
		</Routes>
	)
}

export default App;