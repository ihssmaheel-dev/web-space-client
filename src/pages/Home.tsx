import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import WebsiteCard from '../components/WebsiteCard';
import AddCategoryModal from '../components/AddCategoryModal';

interface CategoryI {
    name: string;
    icon: string;
    websites?: WebsiteI[];
}

type ImageType = "icon" | "image";

interface WebsiteI {
    name: string;
    image?: string;
    imageType?: ImageType;
    description: string;
    link: string;
}

const Home: React.FC = () => {
    const { tab } = useParams<{ tab?: string }>();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    const categories: CategoryI[] = [
        {
            name: 'Category',
            icon: 'pi pi-fw pi-stop',
            websites: [
                { name: "TechCrunch", description: "Tech news", image: "", imageType:"icon", link: "https://techcrunch.com" },
                { name: "The Verge", description: "Tech reviews", link: "https://www.theverge.com" }
            ]
        }
    ];
    

    const items: MenuItem[] = categories.map((category, index) => ({
        label: category.name,
        icon: category.icon,
        command: () => navigate(`/home/category/${index + 1}`)
    }));

    useEffect(() => {
        const tabIndex = tab ? parseInt(tab) - 1 : 0;
        if (tabIndex >= 0 && tabIndex < categories.length) {
            setActiveIndex(tabIndex);
        } else {
            navigate(`/home/category/1`);
        }
    }, [tab, categories.length, navigate]);

    return (
        <div className="card py-4 px-4">
            <div className="flex justify-content-between align-items-center">
                <TabMenu model={items} activeIndex={activeIndex} />
                <div className="flex align-items-center ml-3">
                    <Button icon="pi pi-plus" className="p-button-primary mr-2" onClick={() => setVisible(true)}/>
                    <Button icon="pi pi-external-link" className="p-button-primary" />
                </div>
            </div>
            
            <AddCategoryModal visible={visible} setVisible={setVisible}/>

            <div className="grid pt-4">
                <div className="col-2">
                    <WebsiteCard title={"asd"} description={"ad"} />
                </div>
                {categories[activeIndex]?.websites?.map((website, idx) => (
                    <div key={idx} className="col-2">
                        <WebsiteCard title={website.name} description={website.description} imageUrl={website.image} imageType={website.imageType} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
