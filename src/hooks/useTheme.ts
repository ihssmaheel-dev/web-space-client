import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "../contexts/ThemeContexts";

const useTheme = (): ThemeContextType => {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error("ThemeContext must be used within a ThemeProvider");
    }

    return themeContext;
}

export default useTheme;