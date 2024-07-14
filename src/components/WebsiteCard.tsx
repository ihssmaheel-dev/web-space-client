import React, { useRef } from 'react';
import { Card } from 'primereact/card';
import { Menu } from 'primereact/menu';
import { MenuItem, MenuItemCommandEvent } from 'primereact/menuitem';
import ImageComponent from './ImageComponent';

type ImageType = "icon" | "image";

interface WebsiteCardProps {
    categoryIndex: number;
    websiteIndex: number;
    title: string;
    link: string;
    imageUrl?: string;
    imageType?: ImageType;
    onEdit: (categoryIndex: number, websiteIndex: number) => void;
    onDelete: (categoryIndex: number, websiteIndex: number) => void;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({
    categoryIndex,
    websiteIndex,
    title,
    link,
    imageUrl,
    imageType,
    onEdit,
    onDelete
}) => {
    const menu = useRef<Menu>(null);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.open(link, "_blank");
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        menu.current?.toggle(e);
    };

    const handleEdit = (event: MenuItemCommandEvent) => {
        menu.current?.hide(event.originalEvent);
        onEdit(categoryIndex, websiteIndex);
    };

    const handleDelete = (event: MenuItemCommandEvent) => {
        menu.current?.hide(event.originalEvent);

        onDelete(categoryIndex, websiteIndex);
    };

    const menuItems: MenuItem[] = [
        { label: 'Edit', icon: 'pi pi-pencil', command: handleEdit },
        { label: 'Delete', icon: 'pi pi-trash', command: handleDelete }
    ];

    return (
        <Card className="h-10rem cursor-pointer shadow-2 hover:shadow-8 transition-all transition-duration-300" onClick={handleClick}>
            <div className="flex flex-column h-full">
                <div className="text-right mb-2">
                    <i 
                        className="pi pi-ellipsis-v text-500 hover:text-primary cursor-pointer ml-2 transition-colors transition-duration-300"
                        onClick={handleMenuClick}
                    ></i>
                    <Menu model={menuItems} popup ref={menu} />
                </div>
                <div className='flex-grow-1 flex flex-column align-items-center justify-content-center'>
                    <ImageComponent image={imageUrl} imageType={imageType} />
                    <p className="m-0 text-center font-semibold uppercase text-overflow-ellipsis overflow-hidden white-space-nowrap w-full px-2 mt-2">
                        {title}
                    </p>
                </div>
            </div>

        </Card>
    );
}

WebsiteCard.displayName = 'WebsiteCard';

export default WebsiteCard;
