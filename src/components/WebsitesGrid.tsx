import React, { useState } from 'react';
import AddCard from './AddCard';
import WebsiteCard from './WebsiteCard';
import { Button } from 'primereact/button';
import { CategoryI, WebsiteI } from '../types';
import useUserActivity from '../hooks/useUserActivity';

interface WebsitesGridProps {
    setAddWebsiteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    categories: CategoryI[];
    activeIndex: number;
    handleEditWebsite: (categoryIndex: number, websiteIndex: number) => void;
    handleWebsiteDelete: (categoryIndex: number, websiteIndex: number) => void;
}

type SortMethod = 'Default' | 'Name' | 'Most used';

const WebsitesGrid: React.FC<WebsitesGridProps> = ({ setAddWebsiteModalVisible, categories, activeIndex, handleEditWebsite, handleWebsiteDelete }) => {
    const { userActivity } = useUserActivity();
    const [sortMethod, setSortMethod] = useState<SortMethod>('Most used');
    
    const sortMethods: SortMethod[] = ['Default', 'Name', 'Most used'];

    const cycleSortMethod = () => {
        const currentIndex = sortMethods.indexOf(sortMethod);
        const nextIndex = (currentIndex + 1) % sortMethods.length;
        setSortMethod(sortMethods[nextIndex]);
    };

    const getSortedWebsites = (): WebsiteI[] | undefined => {
        const websites = categories[activeIndex]?.websites || [];

        switch (sortMethod) {
            case 'Default':
                return websites.sort((a, b) => a.no - b.no);
            case 'Name':
                return websites.sort((a, b) => a.name.localeCompare(b.name));
            case 'Most used':
            default:
                return websites.sort((a, b) => (userActivity[b.id] || 0) - (userActivity[a.id] || 0));
        }
    };

    const sortedWebsites = getSortedWebsites();

    return (
        <div>
            <div className="mt-3">
                <Button label={`Sort by ${sortMethod}`} icon="pi pi-sort-alt" onClick={cycleSortMethod} />
            </div>
            <div className="grid pt-3">
                <div className="col-2">
                    <AddCard onClick={() => setAddWebsiteModalVisible(true)} />
                </div>
                {sortedWebsites?.map((website, idx) => (
                    <div key={idx} className="col-2">
                        <WebsiteCard 
                            categoryIndex={activeIndex} 
                            websiteIndex={idx} 
                            websiteId={website.id} 
                            title={website.name} 
                            link={website.url} 
                            imageUrl={website.image} 
                            imageType={website.imageType} 
                            onEdit={handleEditWebsite} 
                            onDelete={handleWebsiteDelete}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WebsitesGrid;
