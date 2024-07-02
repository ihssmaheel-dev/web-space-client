import React from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Manage from "./pages/Manage";

const App: React.FC = () => {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Navigate to="/home/category/1" replace />}/>
				<Route path="/home/category/:tab" element={<Home />}/>
				<Route path="/manage" element={<Manage />}/>
			</Routes>
		</Router>
	);
}

export default App;
