import { Button } from 'primereact/button'
import { MenuItem } from 'primereact/menuitem'
import { TabMenu } from 'primereact/tabmenu'
import React from 'react'
import ActionButtons from './ActionButtons';

interface CategoryBarProps {
    items: MenuItem[];
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    setAddCategoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleOpenAll: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ items, activeIndex, setActiveIndex, setAddCategoryVisible, handleOpenAll }) => {
    return (
        <div className="flex justify-content-between align-items-center">
            <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
            <ActionButtons setAddCategoryVisible={setAddCategoryVisible} handleOpenAll={handleOpenAll} />
        </div>
    )
}

export default CategoryBar