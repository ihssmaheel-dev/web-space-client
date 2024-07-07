import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import WebsiteCard from '../components/WebsiteCard';
import AddCategoryModal from '../components/AddCategoryModal';
import AddCard from '../components/AddCard';
import useLocalStorage from '../hooks/useLocalStorage';
import AddWebsiteModal from '../components/AddWebsiteModal';

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
            <div className="flex justify-content-between align-items-center">
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                <div className="flex align-items-center ml-3">
                    <Button icon="pi pi-plus" className="p-button-primary mr-2" onClick={() => setAddCategoryVisible(true)}/>
                    <Button icon="pi pi-external-link" className="p-button-primary" onClick={(e) => handleOpenAll(e)}/>
                </div>
            </div>
            
            <AddCategoryModal visible={addCategoryVisible} setVisible={setAddCategoryVisible} categoriesLength={categories.length} onAddCategory={handleAddCategory}/>

            <AddWebsiteModal visible={addWebsiteModalVisible} setVisible={setAddWebsiteModalVisible} categoryIndex={activeIndex} categories={categories} onAddWebsite={handleAddWebsite} />

            <div className="grid pt-4">
                <div className="col-2">
                    <AddCard onClick={() => setAddWebsiteModalVisible(true)}/>
                </div>
                {categories[activeIndex]?.websites?.map((website, idx) => (
                    <div key={idx} className="col-2">
                        <WebsiteCard title={website.name} description={website.description} link={website.url} imageUrl={website.image} imageType={website.imageType} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
