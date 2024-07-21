import { Button } from 'primereact/button';
import React from 'react'

interface ActionButtonsProps {
    setAddCategoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleOpenAll: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ setAddCategoryVisible, handleOpenAll }) => {
    return (
        <div className="flex align-items-center ml-3">
            <Button icon="pi pi-plus" className="p-button-primary mr-2" onClick={() => setAddCategoryVisible(true)}/>
            <Button icon="pi pi-external-link" className="p-button-primary" onClick={(e) => handleOpenAll(e)}/>
        </div>
    )
}

export default ActionButtons;