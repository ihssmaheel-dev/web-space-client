import React from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { NavLink, useLocation } from 'react-router-dom';
import useTheme from '../hooks/useTheme';

const Header: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const renderNavLink = (label: string, icon: string, to: string) => {
        return (
            <NavLink to={to} className='p-menuitem-link'>
                <span className={icon}></span>
                <span className="p-menuitem-text">{label}</span>
            </NavLink>
        )
    }

    const items: MenuItem[] = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            className: `ml-4 ${location.pathname.startsWith("/home") ? "p-focus" : ""}`,
            template: (item, options) => renderNavLink(item.label!, options.iconClassName, "/")
        },
        {
            label: 'Manage',
            icon: 'pi pi-pen-to-square',
            className: `ml-2 ${location.pathname.startsWith("/manage") ? "p-focus" : ""}`,
            template: (item, options) => renderNavLink(item.label!, options.iconClassName, "/manage")
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