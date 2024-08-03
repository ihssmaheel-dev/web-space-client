import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
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

    const toast = useRef<Toast>(null);
    
    const categoriesObj: CategoryI[] = [
        {
            no: 0,
            id: crypto.randomUUID(),
            name: 'Favorites',
            icon: 'pi-heart',
            createdAt: Date.now(),
            websites: [
                { no: 0, id: crypto.randomUUID(), name: "youtube", image: "pi-youtube", imageType: "icon", url: "https://youtube.com", createdAt: Date.now() },
                { no: 1, id: crypto.randomUUID(), name: "google", image: "pi-google", imageType: "icon", url: "https://google.com", createdAt: Date.now() },
            ]
        }
    ];

    const [categories, setCategories] = useLocalStorage<CategoryI[]>("categories", categoriesObj);

    const updateCategories = useCallback((newCategories: CategoryI[]) => {
        setCategories(newCategories);
    }, []);

    const handleAddCategory = (newCategory: CategoryI) => {
        setCategories(prevCategories => [...prevCategories, newCategory]);
        showToast("success", "Category Added Successfully");
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

    const handleUpdateCategory = (updatedCategory: CategoryI) => {
        if(updatedCategory) {
            setCategories(prevCategories => {
                const updatedCategories = [...prevCategories];
                updatedCategories[updatedCategory.no] = updatedCategory;
                return updatedCategories;
            });
            setEditCategoryVisible(false);
            setSelectedCategoryIndex(null);
            showToast("success", "Category updated successfully");
        }
    }

    const category = selectedWebsite ? categories[selectedWebsite.categoryIndex] : null;
    const website = selectedWebsite && category && category.websites ? category?.websites[selectedWebsite.websiteIndex] : null;

    const handleEditWebsite = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex });
        setEditWebsiteModalVisible(true);
    }

    const handleUpdateWebsite = (updatedWebsite: WebsiteI) => {
        if (selectedWebsite) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            setCategories(prevCategories => {
                const updatedCategories = [...prevCategories];
                if (updatedCategories[categoryIndex]?.websites) {
                    updatedCategories[categoryIndex].websites[websiteIndex] = updatedWebsite;
                }
                return updatedCategories;
            });

            setEditWebsiteModalVisible(false);
            setSelectedWebsite(null);
            showToast("success", "Website updated successfully");
        }
    }

    const handleWebsiteDelete = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex, title: categories[categoryIndex].websites ? categories[categoryIndex].websites[websiteIndex].name : "" });
        setConfirmDeleteVisible(true);
    }

    const confirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedWebsite !== null) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            const updatedCategories = [...categories];
            updatedCategories[categoryIndex].websites?.splice(websiteIndex, 1);
            setCategories(updatedCategories);
            setConfirmDeleteVisible(false);

            showToast("success", "Website deleted successfully");
        }

        if(selectedCategoryIndex !== null) {
            if(categories.length === 1) {
                showToast("error", "Cannot delete last category");
                setConfirmDeleteVisible(false);
                return;
            }

            const updatedCategories = [...categories];
            updatedCategories.splice(selectedCategoryIndex, 1);
            setCategories(updatedCategories);
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

    const handleEditCategory = (index: number) => {
        setSelectedCategoryIndex(index);
        setEditCategoryVisible(true);
    };

    const handleDeleteCategory = (index: number) => {
        setSelectedCategoryIndex(index);
        setConfirmDeleteVisible(true);
    };

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
            <Toast ref={toast} />
            <CategoryBar
                categories={categories}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                setAddCategoryVisible={setAddCategoryVisible}
                handleOpenAll={handleOpenAll}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
            />
            <WebsitesGrid
                setAddWebsiteModalVisible={setAddWebsiteModalVisible}
                categories={categories}
                activeIndex={activeIndex}
                handleEditWebsite={handleEditWebsite}
                handleWebsiteDelete={handleWebsiteDelete}
                updateCategories={updateCategories}
            />
            <AddCategoryModal
                visible={addCategoryVisible}
                setVisible={setAddCategoryVisible}
                categories={categories}
                onAddCategory={handleAddCategory}
            />
            <EditCategoryModal visible={editCategoryVisible}
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
                website={website}
                onUpdateWebsite={handleUpdateWebsite}
            />
            <ConfirmDeleteModal
                visible={confirmDeleteVisible}
                confirmDelete={confirmDelete}
                cancelDelete={cancelDelete}
                title={selectedWebsite?.title || ""}
            />
        </div>
    );
};

export default Home;
