import React, { useCallback } from 'react';
import { 
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddCard from './AddCard';
import WebsiteCard, { WebsiteCardProps } from './WebsiteCard';
import { Button } from 'primereact/button';
import { CategoryI, WebsiteI } from '../types';
import useUserActivity from '../hooks/useUserActivity';
import useLocalStorage from '../hooks/useLocalStorage';

interface WebsitesGridProps {
    setAddWebsiteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    categories: CategoryI[];
    activeIndex: number;
    handleEditWebsite: (categoryIndex: number, websiteIndex: number) => void;
    handleWebsiteDelete: (categoryIndex: number, websiteIndex: number) => void;
    updateCategories: (newCategories: CategoryI[]) => void;
}

interface SortableWebsiteCardProps extends Omit<WebsiteCardProps, 'websiteIndex'> {
    website: WebsiteI;
}

type SortMethod = 'Default' | 'Name' | 'Most used';

const SortableWebsiteCard: React.FC<SortableWebsiteCardProps> = ({ website, ...props }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: website.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <WebsiteCard 
                {...props}
                websiteIndex={website.no}
                websiteId={website.id}
                title={website.name}
                link={website.url}
                imageUrl={website.image}
                imageType={website.imageType}
            />
        </div>
    );
};

const WebsitesGrid: React.FC<WebsitesGridProps> = ({ 
    setAddWebsiteModalVisible, 
    categories, 
    activeIndex, 
    handleEditWebsite, 
    handleWebsiteDelete,
    updateCategories
}) => {
    const { userActivity } = useUserActivity();
    const [sortMethod, setSortMethod] = useLocalStorage<SortMethod>('sortBy', 'Default');
    
    const sortMethods: SortMethod[] = ['Default', 'Name', 'Most used'];

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const cycleSortMethod = () => {
        const currentIndex = sortMethods.indexOf(sortMethod);
        const nextIndex = (currentIndex + 1) % sortMethods.length;
        setSortMethod(sortMethods[nextIndex]);
    };

    const getSortedWebsites = useCallback((): WebsiteI[] => {
        const websites = categories[activeIndex]?.websites || [];

        switch (sortMethod) {
            case 'Default':
                return [...websites].sort((a, b) => a.no - b.no);
            case 'Name':
                return [...websites].sort((a, b) => a.name.localeCompare(b.name));
            case 'Most used':
                return [...websites].sort((a, b) => (userActivity[b.id] || 0) - (userActivity[a.id] || 0));
            default:
                return [...websites].sort((a, b) => a.no - b.no);
        }
    }, [categories, activeIndex, sortMethod, userActivity]);

    const sortedWebsites = getSortedWebsites();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = sortedWebsites.findIndex((website) => website.id === active.id);
            const newIndex = sortedWebsites.findIndex((website) => website.id === over?.id);

            const newWebsites = arrayMove(sortedWebsites, oldIndex, newIndex);

            // Update the 'no' property for each website
            newWebsites.forEach((website, index) => {
                website.no = index;
            });

            const newCategories = [...categories];
            newCategories[activeIndex].websites = newWebsites;
            updateCategories(newCategories);
        }
    };

    return (
        <div>
            <div className="mt-3">
                <Button label={`Sort by ${sortMethod}`} icon="pi pi-sort-alt" onClick={cycleSortMethod} />
            </div>
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={sortedWebsites.map(website => website.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid pt-3">
                        <div className="col-2">
                            <AddCard onClick={() => setAddWebsiteModalVisible(true)} />
                        </div>
                        {sortedWebsites.map((website) => (
                            <div key={website.id} className="col-2 select-none">
                                <SortableWebsiteCard
                                    website={website}
                                    categoryIndex={activeIndex} 
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
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default React.memo(WebsitesGrid);