import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem } from 'primereact/menuitem';
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

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { tab } = useParams<{ tab?: string }>();
    const { logVisit } = useUserActivity();
    const [activeIndex, setActiveIndex] = useState(0);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const [addWebsiteModalVisible, setAddWebsiteModalVisible] = useState(false);
    const [editWebsiteModalVisible, setEditWebsiteModalVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<{ categoryIndex: number, websiteIndex: number, title?: string} | null>(null);

    const toast = useRef<Toast>(null);
    
    const categoriesObj: CategoryI[] = [
        {
            no: 0,
            id: crypto.randomUUID(),
            name: 'Favorites',
            icon: 'pi pi-heart',
            websites: [
                { no: 0, id: crypto.randomUUID(), name: "youtube", image: "pi-youtube", imageType: "icon", url: "https://youtube.com" },
                { no: 1, id: crypto.randomUUID(), name: "google", image: "pi-google", imageType: "icon", url: "https://google.com" },
            ]
        }
    ];

    const [categories, setCategories] = useLocalStorage<CategoryI[]>("categories", categoriesObj);

    const items: MenuItem[] = categories.map((category, index) => ({
        label: category.name,
        icon: `pi ${category.icon}`,
        command: () => navigate(`/home/category/${index + 1}`),
    }));

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

    const category = selectedWebsite ? categories[selectedWebsite.categoryIndex] : null;
    const website = selectedWebsite && category && category.websites ? category?.websites[selectedWebsite.websiteIndex] : null;

    const handleEditWebsite = (categoryIndex: number, websiteIndex: number) => {
        setSelectedWebsite({ categoryIndex, websiteIndex });
        setEditWebsiteModalVisible(true);
    }

    const handleUpdateWebsite = (updatedWebsite: WebsiteI) => {
        if(selectedWebsite) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            setCategories(prevCategories => {
                const updatedCategories = [...prevCategories];
                if(updatedCategories[categoryIndex]?.websites) {
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
        if(selectedWebsite) {
            const { categoryIndex, websiteIndex } = selectedWebsite;
            const updatedCategories = [...categories];
            updatedCategories[categoryIndex].websites?.splice(websiteIndex, 1);

            setCategories(updatedCategories);
            setConfirmDeleteVisible(false);
        }
        

        setConfirmDeleteVisible(false);
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
            <Toast ref={toast} />

            <CategoryBar items={items} activeIndex={activeIndex} setActiveIndex={setActiveIndex} setAddCategoryVisible={setAddCategoryVisible} handleOpenAll={handleOpenAll} />

            <WebsitesGrid setAddWebsiteModalVisible={setAddWebsiteModalVisible} categories={categories} activeIndex={activeIndex} handleEditWebsite={handleEditWebsite} handleWebsiteDelete={handleWebsiteDelete} />

            <AddCategoryModal visible={addCategoryVisible} setVisible={setAddCategoryVisible} categories={categories} onAddCategory={handleAddCategory}/>

            <AddWebsiteModal visible={addWebsiteModalVisible} setVisible={setAddWebsiteModalVisible} categoryIndex={activeIndex} categories={categories} onAddWebsite={handleAddWebsite} />

            <EditWebsiteModal visible={editWebsiteModalVisible} setVisible={setEditWebsiteModalVisible} website={website} onUpdateWebsite={handleUpdateWebsite}/>

            <ConfirmDeleteModal visible={confirmDeleteVisible} confirmDelete={confirmDelete} cancelDelete={cancelDelete} title={selectedWebsite?.title || ""} />
        </div>
    );
};

export default Home;
