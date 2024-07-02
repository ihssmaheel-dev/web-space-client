import React, { useContext } from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContexts';

const Header: React.FC = () => {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error("ThemeContext must be used within a ThemeProvider");
    }

    const { theme, toggleTheme } = themeContext;

    const items: MenuItem[] = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            className: 'ml-4',
            template: (item, options) => (
                <NavLink to="/" className={({ isActive }) => isActive ? 'p-menuitem-link p-menuitem-link-active' : 'p-menuitem-link'}>
                    <span className={options.iconClassName}></span>
                    <span className="p-menuitem-text">{item.label}</span>
                </NavLink>
            )
        },
        {
            label: 'Manage',
            icon: 'pi pi-pencil',
            className: 'ml-4',
            template: (item, options) => (
                <NavLink to="/manage" className={({ isActive }) => isActive ? 'p-menuitem-link p-menuitem-link-active' : 'p-menuitem-link'}>
                    <span className={options.iconClassName}></span>
                    <span className="p-menuitem-text">{item.label}</span>
                </NavLink>
            )
        },
    ];

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    const end = (
        <div className="flex align-items-center gap-4">
            <i 
                className={`pi ${theme === 'theme-light' ? 'pi-moon' : 'pi-sun'} text-lg hover:text-primary cursor-pointer transition-colors transition-duration-300`} 
                onClick={toggleTheme}
            ></i>
            <i className='pi pi-cog text-lg hover:text-primary cursor-pointer transition-colors transition-duration-300'></i>
        </div>
    );

    return ( <Menubar className='border-none border-noround py-2 px-5' model={items} start={start} end={end} /> )
}

export default Header