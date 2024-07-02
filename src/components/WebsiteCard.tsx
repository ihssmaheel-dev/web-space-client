import React, { useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';

interface WebsiteCardProps {
    title: string;
    description: string;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ title, description }) => {
    const op = useRef<OverlayPanel>(null);

    const handleMouseOver = (e: React.MouseEvent) => op.current?.show(e, e.currentTarget);
    const handleMouseOut = () => op.current?.hide();

    return (
        <div className="custom-card h-10rem p-2 cursor-pointer border-round-md shadow-1 bg-white relative">
            <div className="text-right">
                <i 
                    className="pi pi-info-circle text-primary" 
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                ></i>
            </div>
            <div className='flex flex-column align-items-center'>
                <img alt="logo" src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" height="50" className="mr-2 mt-2"></img>
                <p className="mt-4 p-0 text-base font-bold uppercase">
                    {title}
                </p>
            </div>
            <OverlayPanel ref={op} className="min-w-100 max-w-25rem break-word">
                <p>{description}</p>
            </OverlayPanel>
        </div>
    )
}

WebsiteCard.displayName = 'WebsiteCard';

export default WebsiteCard;