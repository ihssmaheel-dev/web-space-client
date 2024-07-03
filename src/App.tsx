import React from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Manage from "./pages/Manage";
import useTheme from "./hooks/useTheme";

const App: React.FC = () => {
    const { theme } = useTheme();

	return (
		<Router>
			<div className={`${theme === 'theme-light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
				<Header />
				<Routes>
					<Route path="/" element={<Navigate to="/home/category/1" replace />}/>
					<Route path="/home/category/:tab" element={<Home />}/>
					<Route path="/manage" element={<Manage />}/>
				</Routes>
			</div>	
		</Router>
	);
}

export default App;
