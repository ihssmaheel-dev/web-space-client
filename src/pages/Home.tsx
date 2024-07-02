// src/pages/Home.tsx
import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import WebsiteCard from '../components/WebsiteCard';

interface CategoryI {
    name: string;
    icon: string;
    websites?: WebsiteI[];
}

interface WebsiteI {
    name: string;
    icon?: string;
    description: string;
    link: string;
}

const Home: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const categories: CategoryI[] = [
        {
            name: 'Tab 1', 
            icon: 'pi pi-fw pi-home', 
            websites: [
                { name: "google", description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error numquam voluptate magnam saepe enim! Nesciunt provident in dolore ipsa praesentium!", link: "www.google.com" },
                { name: "youtube", description: "youtube", link: "www.youtube.com" }
            ]
        },
        { name: 'Tab 2', icon: 'pi pi-fw pi-calendar' },
        { name: 'Tab 3', icon: 'pi pi-fw pi-pencil' },
        { name: 'Tab 4', icon: 'pi pi-fw pi-file' },
        { name: 'Tab 5', icon: 'pi pi-fw pi-cog' },
        { name: 'Tab 6', icon: 'pi pi-fw pi-star' },
        { name: 'Tab 7', icon: 'pi pi-fw pi-user' },
        { name: 'Tab 8', icon: 'pi pi-fw pi-heart' }
    ];

    const tabHeaderTemplate = (category: CategoryI) => (
        <span>
            <i className={`${category.icon} tab-icon mr-2`}></i>
            {category.name}
        </span>
    );

    return (
        <div className="card py-3 px-6">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} scrollable>
                {categories.map((category, index) => (
                    <TabPanel key={index} header={tabHeaderTemplate(category)} className="pt-3">
                        <div className="grid">
                            {category.websites?.map((website, idx) => (
                                <div key={idx} className="col-2">
                                    <WebsiteCard title={website.name} description={website.description} />
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                ))}
            </TabView>
        </div>
    );
};

export default Home;