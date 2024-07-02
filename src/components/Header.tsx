import React from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { Avatar } from 'primereact/avatar';  
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
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
            icon: 'pi pi-cog',
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
        <div className="flex align-items-center gap-2">
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
        </div>
    );

    return (
        <div className="card">
            <Menubar className='border-none py-3 px-6' model={items} start={start} end={end} />
        </div>
    )
}

export default Header