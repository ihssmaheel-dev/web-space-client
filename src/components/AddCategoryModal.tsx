import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { icons } from "../utils/icons";
import IconDropdown from "./IconDropdown";

interface AddCategoryModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, setVisible }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryIcon, setCategoryIcon] = useState('');
    const [description, setDescription] = useState('');
    
    const handleSubmit = () => {
        console.log("category name: ", categoryName);
        console.log("category icon: ", categoryIcon);
        console.log("description: ", description);
    }

    return (
        <div>
            <Dialog visible={visible} style={{ width: '46vw' }} onHide={() => setVisible(false)} header="Add Category">
                <form action="#">
                    <div className="mb-5">
                        <div className="grid mb-2">
                            <div className="flex flex-column gap-2 col-6">
                                <label htmlFor="categoryName">Category name</label>
                                <InputText id="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
                            </div>
                            <div className="flex flex-column gap-2 col-6">
                                <label htmlFor="categoryIcon">Category Icon</label>
                                <IconDropdown value={categoryIcon} onChange={setCategoryIcon} icons={icons}/>
                            </div>
                        </div>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                        </div>
                    </div>
                    <div className="p-mt-4">
                        <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} className="mr-2"/>
                        <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={() => setVisible(false)} />
                    </div>
                </form>
            </Dialog>
        </div>
    )
}

export default AddCategoryModal;