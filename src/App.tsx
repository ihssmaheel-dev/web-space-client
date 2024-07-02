import React, { useContext } from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Manage from "./pages/Manage";
import { ThemeContext } from "./contexts/ThemeContexts";

const App: React.FC = () => {
	const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error("ThemeContext must be used within a ThemeProvider");
    }

    const { theme } = themeContext;

	return (
		<Router>
			<div className={`${theme === 'theme-light' ? 'bg-gray-100' : 'bg-gray-900'} h-screen`}>
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
