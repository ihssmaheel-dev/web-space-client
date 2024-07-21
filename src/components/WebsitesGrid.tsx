import React from 'react'
import AddCard from './AddCard'
import WebsiteCard from './WebsiteCard';
import { CategoryI } from '../types';

interface WebsitesGridProps {
    setAddWebsiteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    categories: CategoryI[];
    activeIndex: number;
    handleEditWebsite: (categoryIndex: number, websiteIndex: number) => void;
    handleWebsiteDelete: (categoryIndex: number, websiteIndex: number) => void;
}

const WebsitesGrid: React.FC<WebsitesGridProps> = ({ setAddWebsiteModalVisible, categories, activeIndex, handleEditWebsite, handleWebsiteDelete  }) => {
    return (
        <div className="grid pt-4">
            <div className="col-2">
                <AddCard onClick={() => setAddWebsiteModalVisible(true)}/>
            </div>
            {categories[activeIndex]?.websites?.map((website, idx) => (
                <div key={idx} className="col-2">
                    <WebsiteCard categoryIndex={activeIndex} websiteIndex={idx} title={website.name} link={website.url} imageUrl={website.image} imageType={website.imageType} onEdit={handleEditWebsite} onDelete={handleWebsiteDelete}/>
                </div>
            ))}
        </div>
    )
}

export default WebsitesGrid