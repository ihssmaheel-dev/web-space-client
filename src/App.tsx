import React from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Manage from "./pages/Manage";

const App: React.FC = () => {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Home />}/>
				<Route path="/manage" element={<Manage />}/>
			</Routes>
		</Router>
	);
}

export default App;
