import React, { useRef } from 'react';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';
import { useNavigate } from 'react-router-dom';
import ActionButtons from './ActionButtons';
import { CategoryI } from '../types';

interface CategoryBarProps {
    categories: CategoryI[];
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    setAddCategoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleOpenAll: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onEditCategory: (index: number) => void;
    onDeleteCategory: (index: number) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({
    categories,
    activeIndex,
    setActiveIndex,
    setAddCategoryVisible,
    handleOpenAll,
    onEditCategory,
    onDeleteCategory
}) => {
    const navigate = useNavigate();
    const menu = useRef<Menu>(null);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState<number | null>(null);

    const handleMenuClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setSelectedCategoryIndex(index);
        menu.current?.toggle(e);
    };

    const menuItems: MenuItem[] = [
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => {
                if (selectedCategoryIndex !== null) {
                    onEditCategory(selectedCategoryIndex);
                    setSelectedCategoryIndex(null);
                }
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
                if (selectedCategoryIndex !== null) {
                    onDeleteCategory(selectedCategoryIndex);
                    setSelectedCategoryIndex(null);
                }
            }
        }
    ];

    if(categories.length === 1) {
        menuItems.pop();
    }

    const itemRenderer = (item: CategoryI, itemIndex: number) => (
        <div className="flex align-items-center">
            <a
                className="p-menuitem-link flex align-items-center"
                onClick={() => navigate(`/home/category/${itemIndex + 1}`)}
            >
                <i className={`pi pi-fw ${item.icon} mr-2`}></i>
                <span className="font-bold">{item.name}</span>
                {itemIndex === activeIndex && (
                    <>
                        <i
                            className="pi pi-fw pi-ellipsis-v text-500 hover:text-primary cursor-pointer transition-colors transition-duration-300 ml-3 text-xs mt-1"
                            onClick={(e) => handleMenuClick(e, itemIndex)}
                        ></i>
                        <Menu
                            model={menuItems}
                            popup
                            ref={menu}
                        />
                    </>
                )}
            </a>
        </div>
    );

    const items = categories.map((category, index) => ({
        template: itemRenderer(category, index),
        command: () => navigate(`/home/category/${index + 1}`),
    }));

    return (
        <div className="flex justify-content-between align-items-center">
            <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
            <ActionButtons setAddCategoryVisible={setAddCategoryVisible} handleOpenAll={handleOpenAll} />
        </div>
    );
};

export default CategoryBar;
