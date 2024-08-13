import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddCategoryModal from '../components/AddCategoryModal';
import useLocalStorage from '../hooks/useLocalStorage';
import AddWebsiteModal from '../components/AddWebsiteModal';
import EditWebsiteModal from '../components/EditWebsiteModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import WebsitesGrid from '../components/WebsitesGrid';
import CategoryBar from '../components/CategoryBar';
import { CategoryI, WebsiteI } from '../types';
import { useToast } from '../contexts/ToastContexts';
import useUserActivity from '../hooks/useUserActivity';
import EditCategoryModal from '../components/EditCategoryModal';
import { getLocalStorageValue } from '../utils/localStorageUtils';
import useBookmarks from '../hooks/useBookmarks';
import useCategories from '../hooks/useCategories';
import useWebsites from '../hooks/useWebsites';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { tab } = useParams<{ tab?: string }>();
    const { logVisit } = useUserActivity();
    const [activeIndex, setActiveIndex] = useState(0);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const [editCategoryVisible, setEditCategoryVisible] = useState(false);
    const [addWebsiteModalVisible, setAddWebsiteModalVisible] = useState(false);
    const [editWebsiteModalVisible, setEditWebsiteModalVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<{ categoryIndex: number, websiteIndex: number, title?: string } | null>(null);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
    
    const categoriesObj: CategoryI[] = [];

    const [categories, setCategories] = useLocalStorage<CategoryI[]>("categories", categoriesObj);

    // const { syncLoading, triggerSync } = useBookmarks(setCategories);
    const { handleAddCategory, handleUpdateCategory, handleDeleteCategory } = useCategories(categories, setCategories);
    const { handleAddWebsite, handleUpdateWebsite, handleDeleteWebsite } = useWebsites(categories, setCategories);

    const categoriesLocal = getLocalStorageValue("categories");
    if(categoriesLocal === null) { setCategories(categoriesObj); }

    const category = selectedWebsite ? categories[selectedWebsite.categoryIndex] : null;
    const website = selectedWebsite && category && category.websites ? category?.websites[selectedWebsite.websiteIndex] : null;

    const handleEditCategory = (index: number) => {
        setSelectedCategoryIndex(index);
        setEditCategoryVisible(true);
    };

    const handleEditWebsite = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex });
        setEditWebsiteModalVisible(true);
    }

    const confirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedWebsite !== null) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            const websiteId = categories && categories[categoryIndex] && categories[categoryIndex]?.websites && categories[categoryIndex]?.websites[websiteIndex]?.id;
            if (websiteId !== undefined) {
                handleDeleteWebsite(websiteId);
            }
            setConfirmDeleteVisible(false);
            showToast("success", "Website deleted successfully");
        }

        if(selectedCategoryIndex !== null) {
            if(categories.length === 1) {
                showToast("error", "Cannot delete last category");
                setConfirmDeleteVisible(false);
                return;
            }

            handleDeleteCategory(categories[selectedCategoryIndex].id);
            setConfirmDeleteVisible(false);
            showToast("success", "Category deleted successfully");
        }
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmDeleteVisible(false);
    };

    const handleOpenAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const index = tab ? parseInt(tab) - 1 : undefined;
        if (typeof index === "number" && categories[index]?.websites) {
            const websites = categories[index].websites;
            websites?.forEach(website => {
                console.log(website.url);
                logVisit(website.id);
                window.open(website.url, "_blank");
            });
        } else {
            console.error(`Invalid tab index or missing websites for tab index ${index}`);
        }
    }

    useEffect(() => {
        const tabIndex = tab ? parseInt(tab) - 1 : 0;
        if (tabIndex >= 0 && tabIndex < categories.length) {
            setActiveIndex(tabIndex);
        } else {
            navigate(`/home/category/1`);
        }
    }, [tab, categories]);

    return (
        <div className="card py-4 px-4">
            <CategoryBar
                categories={categories}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                setAddCategoryVisible={setAddCategoryVisible}
                handleOpenAll={handleOpenAll}
                onEditCategory={handleEditCategory}
                onDeleteCategory={(index) => {
                    setSelectedCategoryIndex(index);
                    setConfirmDeleteVisible(true);
                }}
            />
            <WebsitesGrid
                setAddWebsiteModalVisible={setAddWebsiteModalVisible}
                categories={categories}
                activeIndex={activeIndex}
                handleEditWebsite={handleEditWebsite}
                handleWebsiteDelete={(categoryIndex, websiteIndex) => {
                    setSelectedWebsite({ categoryIndex, websiteIndex, title: categories[categoryIndex].websites ? categories[categoryIndex].websites[websiteIndex].name : "" });
                    setConfirmDeleteVisible(true);
                }}
                updateCategories={setCategories}
            />
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
                category={categories[activeIndex]}
                onUpdateCategory={handleUpdateCategory}
            />
            <AddWebsiteModal
                visible={addWebsiteModalVisible}
                setVisible={setAddWebsiteModalVisible}
                categoryIndex={activeIndex}
                categories={categories}
                onAddWebsite={handleAddWebsite}
            />
            <EditWebsiteModal
                visible={editWebsiteModalVisible}
                setVisible={setEditWebsiteModalVisible}
                categoryIndex={activeIndex}
                categories={categories}
                website={website}
                onUpdateWebsite={handleUpdateWebsite}
            />
            <ConfirmDeleteModal
                visible={confirmDeleteVisible}
                confirmDelete={confirmDelete}
                cancelDelete={cancelDelete}
                title={selectedWebsite?.title || categories[selectedCategoryIndex || 0]?.name || ""}
            />
        </div>
    );
};

export default Home;