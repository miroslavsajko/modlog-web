import {Link, Route, Routes} from "react-router-dom";
import PostsPage from "./pages/PostsPage.tsx";
import ChartPage from "./pages/ChartPage.tsx";
// import "./App.scss"

function App() {
	return (
		<>
			<nav style={{ padding: 10 }}>
				<Link to="/" style={{ marginRight: 10 }}>New Modlog</Link>
				<Link to="/chart">Chart</Link>
			</nav>
			<Routes>
				<Route path="/" element={<PostsPage />} />
				<Route path="/chart" element={<ChartPage />} />
			</Routes>
		</>
	)
}

export default App;