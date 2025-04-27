// libs
// components
import Header from './components/Header';
import Footer from './components/Footer';
// css
import "./css/global.scss";
import {PostsGrid} from "./components/PostsGrid.tsx";
import {MobileWarning} from "./components/MobileWarning.tsx";

function MasterDetail() {
	return (
		<>
			<Header />
		
			<main>
				<MobileWarning/>
				<PostsGrid />
			</main>

			<Footer />
		</>
	)
}

export default MasterDetail;