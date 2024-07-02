import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
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
    const { tab } = useParams<{ tab?: string }>();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    const categories: CategoryI[] = [
        {
            name: 'Technology',
            icon: 'pi pi-fw pi-desktop',
            websites: [
                { name: "TechCrunch", description: "Tech news", link: "https://techcrunch.com" },
                { name: "The Verge", description: "Tech reviews", link: "https://www.theverge.com" }
            ]
        },
        {
            name: 'Sports',
            icon: 'pi pi-fw pi-football',
            websites: [
                { name: "ESPN", description: "Sports news", link: "https://www.espn.com" },
                { name: "NFL.com", description: "NFL news", link: "https://www.nfl.com" }
            ]
        },
        {
            name: 'Cooking',
            icon: 'pi pi-fw pi-utensils',
            websites: [
                { name: "AllRecipes", description: "Recipes", link: "https://www.allrecipes.com" },
                { name: "Serious Eats", description: "Food culture", link: "https://www.seriouseats.com" }
            ]
        },
        {
            name: 'Finance',
            icon: 'pi pi-fw pi-money-bill',
            websites: [
                { name: "Bloomberg", description: "Financial news", link: "https://www.bloomberg.com" },
                { name: "Yahoo Finance", description: "Stock market info", link: "https://finance.yahoo.com" }
            ]
        },
        {
            name: 'Travel',
            icon: 'pi pi-fw pi-globe',
            websites: [
                { name: "Lonely Planet", description: "Travel guides", link: "https://www.lonelyplanet.com" },
                { name: "TripAdvisor", description: "Travel reviews", link: "https://www.tripadvisor.com" }
            ]
        },
        {
            name: 'Health',
            icon: 'pi pi-fw pi-heart',
            websites: [
                { name: "WebMD", description: "Health advice", link: "https://www.webmd.com" },
                { name: "Healthline", description: "Medical information", link: "https://www.healthline.com" }
            ]
        },
        {
            name: 'Entertainment',
            icon: 'pi pi-fw pi-video',
            websites: [
                { name: "IMDb", description: "Movie database", link: "https://www.imdb.com" },
                { name: "Variety", description: "Entertainment news", link: "https://variety.com" }
            ]
        },
        {
            name: 'News',
            icon: 'pi pi-fw pi-newspaper',
            websites: [
                { name: "BBC News", description: "World news", link: "https://www.bbc.com/news" },
                { name: "CNN", description: "Breaking news", link: "https://www.cnn.com" }
            ]
        },
        {
            name: 'Education',
            icon: 'pi pi-fw pi-graduation-cap',
            websites: [
                { name: "Khan Academy", description: "Online education", link: "https://www.khanacademy.org" },
                { name: "Coursera", description: "Online courses", link: "https://www.coursera.org" }
            ]
        },
        {
            name: 'Shopping',
            icon: 'pi pi-fw pi-shopping-cart',
            websites: [
                { name: "Amazon", description: "Online shopping", link: "https://www.amazon.com" },
                { name: "Etsy", description: "Handmade goods", link: "https://www.etsy.com" }
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
                    <Button icon="pi pi-plus" className="p-button-primary mr-2" />
                    <Button icon="pi pi-external-link" className="p-button-primary" />
                </div>
            </div>
            <div className="grid pt-4">
                {categories[activeIndex]?.websites?.map((website, idx) => (
                    <div key={idx} className="col-2">
                        <WebsiteCard title={website.name} description={website.description} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
