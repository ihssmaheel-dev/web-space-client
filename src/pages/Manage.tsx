import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CategoryI, WebsiteI } from '../types';
import { getLocalStorageValue } from '../utils/localStorageUtils';
import EditCategoryModal from '../components/EditCategoryModal';
import EditWebsiteModal from '../components/EditWebsiteModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import AddCategoryModal from '../components/AddCategoryModal';
import AddWebsiteModal from '../components/AddWebsiteModal';
import { useToast } from '../contexts/ToastContexts';
import "./Manage.css";
import useLocalStorage from '../hooks/useLocalStorage';

interface SelectedWebsite {
    categoryIndex: number;
    websiteIndex: number;
    title?: string;
    websites?: any[];
}

const Manage: React.FC = () => {
    const { showToast } = useToast();
    const categoriesbbj = getLocalStorageValue<CategoryI[]>("categories") || [];
    const [categories, setCategories] = useLocalStorage("categories", categoriesbbj);

    const userActivities: { [key: string]: number } = getLocalStorageValue("userActivity") || {};
    const [expandedRows, setExpandedRows] = useState<any>(null);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const [editCategoryVisible, setEditCategoryVisible] = useState(false);
    const [addWebsiteModalVisible, setAddWebsiteModalVisible] = useState(false);
    const [editWebsiteModalVisible, setEditWebsiteModalVisible] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<SelectedWebsite | null>(null);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
    
    const [confirmDeleteVisibleCategory, setConfirmDeleteVisibleCategory] = useState(false);
    const [confirmDeleteVisibleWebsite, setConfirmDeleteVisibleWebsite] = useState(false);

    const handleAddCategory = (newCategory: CategoryI) => {
        setCategories(prevCategories => [...prevCategories, newCategory]);
        showToast("success", "Category Added Successfully");
    };

    const handleEditCategory = (index: number) => {
        setSelectedCategoryIndex(index);
        setEditCategoryVisible(true);
    };

    const handleUpdateCategory = (updatedCategory: CategoryI) => {
        if (updatedCategory) {
            const updatedCategories = [...categories];
            updatedCategories[updatedCategory.no] = updatedCategory;
            setCategories(updatedCategories);
            setEditCategoryVisible(false);
            setSelectedCategoryIndex(0);
            showToast("success", "Category updated successfully");
        }
    };

    const handleEditWebsite = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex });
        setEditWebsiteModalVisible(true);
    };

    const handleUpdateWebsite = (updatedWebsite: WebsiteI) => {
        if (selectedWebsite) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            const updatedCategories = [...categories];
            if (updatedCategories[categoryIndex]?.websites) {
                updatedCategories[categoryIndex].websites[websiteIndex] = updatedWebsite;
            }
            setCategories(updatedCategories);
            setEditWebsiteModalVisible(false);
            setSelectedWebsite(null);
            showToast("success", "Website updated successfully");
        }
    };

    const handleDeleteCategory = (index: number) => {
        setSelectedCategoryIndex(index);
        setConfirmDeleteVisibleCategory(true);
    };

    const handleWebsiteDelete = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex, title: categories[categoryIndex].websites ? categories[categoryIndex].websites[websiteIndex].name : "" });
        setConfirmDeleteVisibleWebsite(true);
    };

    const confirmDeleteCategory = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedCategoryIndex !== null) {
            if (categories.length === 1) {
                showToast("error", "Cannot delete last category");
                setConfirmDeleteVisibleCategory(false);
                return;
            }

            const updatedCategories = [...categories];
            updatedCategories.splice(selectedCategoryIndex, 1);
            setCategories(updatedCategories);
            setConfirmDeleteVisibleCategory(false);
            showToast("success", "Category deleted successfully");
        }
    }

    const confirmDeleteWebsite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedWebsite !== null) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            const updatedCategories = [...categories];
            updatedCategories[categoryIndex].websites?.splice(websiteIndex, 1);
            setCategories(updatedCategories);
            setConfirmDeleteVisibleWebsite(false);
            showToast("success", "Website deleted successfully");
        }
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmDeleteVisibleWebsite(false);
        setConfirmDeleteVisibleCategory(false);
    };

    const handleAddWebsite = (categoryIndex: number, newWebsite: WebsiteI) => {
        setCategories(prevCategories => {
            const updatedCategories = [...prevCategories];
            const category = updatedCategories[categoryIndex];
            if (category) {
                category.websites = category.websites ? [...category.websites, newWebsite] : [newWebsite];
            }
            return updatedCategories;
        });
        showToast("success", "Website Added Successfully");
    };

    const rowExpansionTemplate = (data: CategoryI) => {
        return (
            <>
                <div className='flex align-items-center justify-content-end px-4'>
                    <Button
                        label="Add Website"
                        icon="pi pi-plus"
                        className="mt-2"
                        onClick={() => {
                            setSelectedCategoryIndex(data.no);
                            setAddWebsiteModalVisible(true);
                        }}
                    />
                </div>
            <div className='px-4 py-4'>
                <DataTable value={data.websites} dataKey="id">
                    <Column header="S.No." body={(_rowData: WebsiteI, options) => options.rowIndex + 1} />
                    <Column field="name" header="Website Name" />
                    <Column field="url" header="URL" />
                    <Column field="icon" header="Icon / Image" body={(rowData: WebsiteI) => (rowData.imageType === "icon" ? <i className={`pi ${rowData?.image} text-2xl`}></i> : <img src={rowData?.image} alt="icon" height={24} width={24} />) || ""} />
                    <Column field="visits" header="Total Visits" body={(rowData: WebsiteI) => userActivities[rowData?.id] || 0} />
                    <Column
                        header="Actions"
                        body={(_rowData: WebsiteI, options) => (
                            <>
                                <Button
                                    className='mr-2 custom-button'
                                    icon="pi pi-pencil text-sm"
                                    onClick={() => handleEditWebsite(data.no, options.rowIndex)}
                                />
                                <Button
                                    className='bg-danger border-danger text-white custom-button'
                                    icon="pi pi-trash text-sm"
                                    onClick={() => handleWebsiteDelete(data.no, options.rowIndex)}
                                />
                            </>
                        )}
                    />
                </DataTable>
            </div>
            </>
        );
    };

    return (
        <div className='card py-4 px-4'>
            <div className='flex align-items-center justify-content-end'>
                <Button
                    label="Add Category"
                    icon="pi pi-plus"
                    className="mb-4"
                    onClick={() => setAddCategoryVisible(true)}
                />
            </div>
            <DataTable
                value={categories}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id"
                className="custom-datatable"
            >
                <Column expander style={{ width: '6rem' }}/>
                <Column header="S.No." body={(_rowData: CategoryI, options) => options.rowIndex + 1} />
                <Column field="name" header="Category Name" />
                <Column header="Number of Websites" body={(rowData: CategoryI) => rowData.websites?.length || 0} />
                <Column header="Actions" body={(_rowData: CategoryI, options) => (
                    <>
                        <Button
                            className='mr-2 custom-button'
                            icon="pi pi-pencil text-sm"
                            onClick={() => handleEditCategory(options.rowIndex)}
                        />
                        <Button
                            className='bg-danger border-danger text-white custom-button'
                            icon="pi pi-trash text-sm"
                            onClick={() => handleDeleteCategory(options.rowIndex)}
                        />
                    </>
                )}
                headerClassName="custom-header" />
            </DataTable>

            <AddCategoryModal
                visible={addCategoryVisible}
                setVisible={setAddCategoryVisible}
                categories={categories}
                onAddCategory={handleAddCategory}
            />

            <EditCategoryModal
                visible={editCategoryVisible}
                setVisible={setEditCategoryVisible}
                categories={categories}
                category={categories[selectedCategoryIndex]}
                onUpdateCategory={handleUpdateCategory}
            />

            <AddWebsiteModal
                visible={addWebsiteModalVisible}
                setVisible={setAddWebsiteModalVisible}
                categoryIndex={selectedCategoryIndex}
                categories={categories}
                onAddWebsite={handleAddWebsite}
            />

            <EditWebsiteModal
                visible={editWebsiteModalVisible}
                setVisible={setEditWebsiteModalVisible}
                categoryIndex={selectedWebsite?.categoryIndex ?? 0}
                categories={categories}
                website={selectedWebsite?.websites?.[selectedWebsite?.categoryIndex]?.[selectedWebsite?.websiteIndex]}
                onUpdateWebsite={handleUpdateWebsite}
            />

            <ConfirmDeleteModal
                visible={confirmDeleteVisibleCategory}
                confirmDelete={confirmDeleteCategory}
                cancelDelete={cancelDelete}
                title={categories[selectedCategoryIndex]?.name || ""}
            />

            <ConfirmDeleteModal
                visible={confirmDeleteVisibleWebsite}
                confirmDelete={confirmDeleteWebsite}
                cancelDelete={cancelDelete}
                title={selectedWebsite?.title || ""}
            />
        </div>
    );
};

export default Manage;