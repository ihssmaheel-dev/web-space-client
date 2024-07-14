import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import WebsiteCard from '../components/WebsiteCard';
import AddCategoryModal from '../components/AddCategoryModal';
import AddCard from '../components/AddCard';
import useLocalStorage from '../hooks/useLocalStorage';
import AddWebsiteModal from '../components/AddWebsiteModal';
import { Dialog } from 'primereact/dialog';

interface CategoryI {
    no: number;
    id: string;
    name: string;
    icon: string;
    websites?: WebsiteI[];
}

type ImageType = "icon" | "image";

interface WebsiteI {
    no: number;
    id: string;
    name: string;
    image?: string;
    imageType?: ImageType;
    description: string;
    url: string;
}

const Home: React.FC = () => {
    const { tab } = useParams<{ tab?: string }>();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const [addWebsiteModalVisible, setAddWebsiteModalVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<{ categoryIndex: number, websiteIndex: number, title: string} | null>(null);

    const toast = useRef<Toast>(null);

    const showToast = (severity: 'success' | 'info' | 'warn' | 'error' | undefined, message: string) => {
        if(toast.current) {
            toast.current.show({ severity, detail: message, life: 3000 });
        }
    }
    
    const categoriesObj: CategoryI[] = [
        {
            no: 0,
            id: crypto.randomUUID(),
            name: 'Favorites',
            icon: 'pi pi-heart',
            websites: [
                { no: 0, id: crypto.randomUUID(), name: "youtube", description: "", image: "pi-youtube", imageType: "icon", url: "https://youtube.com" },
                { no: 1, id: crypto.randomUUID(), name: "google", description: "", image: "pi-google", imageType: "icon", url: "https://google.com" },
                { no: 2, id: crypto.randomUUID(), name: "chatgpt", description: "", image: "https://cdn.oaistatic.com/_next/static/media/favicon-32x32.630a2b99.png", imageType: "image", url: "https://chatgpt.com" },
            ]
        }
    ];

    const [categories, setCategories] = useLocalStorage<CategoryI[]>("categories", categoriesObj);

    const items: MenuItem[] = categories.map((category, index) => ({
        label: category.name,
        icon: `pi ${category.icon}`,
        command: () => navigate(`/home/category/${index + 1}`)
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
            <div className="flex justify-content-between align-items-center">
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                <div className="flex align-items-center ml-3">
                    <Button icon="pi pi-plus" className="p-button-primary mr-2" onClick={() => setAddCategoryVisible(true)}/>
                    <Button icon="pi pi-external-link" className="p-button-primary" onClick={(e) => handleOpenAll(e)}/>
                </div>
            </div>
            
            <AddCategoryModal visible={addCategoryVisible} setVisible={setAddCategoryVisible} categories={categories} onAddCategory={handleAddCategory}/>

            <AddWebsiteModal visible={addWebsiteModalVisible} setVisible={setAddWebsiteModalVisible} categoryIndex={activeIndex} categories={categories} onAddWebsite={handleAddWebsite} />

            <div className="grid pt-4">
                <div className="col-2">
                    <AddCard onClick={() => setAddWebsiteModalVisible(true)}/>
                </div>
                {categories[activeIndex]?.websites?.map((website, idx) => (
                    <div key={idx} className="col-2">
                        <WebsiteCard categoryIndex={activeIndex} websiteIndex={idx} title={website.name} description={website.description} link={website.url} imageUrl={website.image} imageType={website.imageType} onDelete={handleWebsiteDelete}/>
                    </div>
                ))}
            </div>

            <Dialog onClick={(e) => { e.stopPropagation(); }} visible={confirmDeleteVisible} onHide={() => cancelDelete} closable={false} modal header="Confirm Delete"
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={cancelDelete}
                        />
                        <Button
                            label="Delete"
                            className="p-button-danger"
                            onClick={confirmDelete}
                        />
                    </div>
                }
            >
                <div>Are you sure you want to delete <b>{selectedWebsite?.title.toLocaleUpperCase()}</b>?</div>
            </Dialog>
        </div>
    );
};

export default Home;
