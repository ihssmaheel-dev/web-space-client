import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CategoryI, SelectedWebsite, WebsiteI } from '../types';
import { getLocalStorageValue } from '../utils/localStorageUtils';
import EditCategoryModal from '../components/EditCategoryModal';
import EditWebsiteModal from '../components/EditWebsiteModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import AddCategoryModal from '../components/AddCategoryModal';
import AddWebsiteModal from '../components/AddWebsiteModal';
import { useToast } from '../contexts/ToastContexts';
import "./Manage.css";
import useLocalStorage from '../hooks/useLocalStorage';
import useUserActivity from '../hooks/useUserActivity';
import { convert } from 'html-to-text';
import useTheme from '../hooks/useTheme';
import useBookmarks from '../hooks/useBookmarks';
import useCategories from '../hooks/useCategories';
import useWebsites from '../hooks/useWebsites';
import CategoriesDatatable from '../components/CategoriesDatatable';

const Manage: React.FC = () => {
    const { showToast } = useToast();
    const categoriesbbj = getLocalStorageValue<CategoryI[]>("categories") || [];
    const [categories, setCategories] = useLocalStorage("categories", categoriesbbj);

    const { syncLoading, triggerSync } = useBookmarks(setCategories);
    const { handleAddCategory, handleUpdateCategory, handleDeleteCategory } = useCategories(categories, setCategories);
    const { handleAddWebsite, handleUpdateWebsite, handleDeleteWebsite } = useWebsites(categories, setCategories);

    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const [editCategoryVisible, setEditCategoryVisible] = useState(false);
    const [addWebsiteModalVisible, setAddWebsiteModalVisible] = useState(false);
    const [editWebsiteModalVisible, setEditWebsiteModalVisible] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<SelectedWebsite | null>(null);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
    const [confirmDeleteVisibleCategory, setConfirmDeleteVisibleCategory] = useState(false);
    const [confirmDeleteVisibleWebsite, setConfirmDeleteVisibleWebsite] = useState(false);

    const confirmDeleteCategory = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedCategoryIndex !== null) {
            const categoryToDelete = categories[selectedCategoryIndex];
            handleDeleteCategory(categoryToDelete.id);
        }
        setConfirmDeleteVisibleCategory(false);
    }

    const confirmDeleteWebsite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedWebsite !== null) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            if (categories && categories[categoryIndex] && categories[categoryIndex].websites) {
                const websiteToDelete = categories[categoryIndex].websites[websiteIndex];
                handleDeleteWebsite(websiteToDelete.id);
            } else {
                showToast("error", "Error deleting website");
            }
        }
        setConfirmDeleteVisibleWebsite(false);
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmDeleteVisibleWebsite(false);
        setConfirmDeleteVisibleCategory(false);
    };

    return (
        <div className='card py-4 px-4'>
            <div className='flex align-items-center justify-content-end'>
                <Button label='Sync Chrome Bookmarks' icon={`pi ${syncLoading ? "pi-spin pi-spinner" : "pi-sync"}`} className='mb-4 mr-2' onClick={triggerSync} disabled={syncLoading} />
                <Button
                    label="Add Category"
                    icon="pi pi-plus"
                    className="mb-4"
                    onClick={() => setAddCategoryVisible(true)}
                />
            </div>
            <CategoriesDatatable setSelectedCategoryIndex={setSelectedCategoryIndex} setEditCategoryVisible={setEditCategoryVisible} setConfirmDeleteVisibleCategory={setConfirmDeleteVisibleCategory} setSelectedWebsite={setSelectedWebsite} setAddWebsiteModalVisible={setAddWebsiteModalVisible} setEditWebsiteModalVisible={setEditWebsiteModalVisible} setConfirmDeleteVisibleWebsite={setConfirmDeleteVisibleWebsite} />

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
                website={selectedWebsite?.website || null}
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