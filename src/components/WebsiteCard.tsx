import React, { useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Card } from 'primereact/card';

interface WebsiteCardProps {
    title: string;
    description: string;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ title, description }) => {
    const op = useRef<OverlayPanel>(null);

    const handleMouseEnter = (e: React.MouseEvent) => op.current?.show(e, e.currentTarget);
    const handleMouseLeave = () => op.current?.hide();

    return (
        <Card className="h-10rem cursor-pointer shadow-2 hover:shadow-8 transition-all transition-duration-300">
            <div className="flex flex-column h-full">
                <div className="text-right mb-2">
                    <i 
                        className="pi pi-info-circle text-500 hover:text-primary cursor-pointer transition-colors transition-duration-300"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    ></i>
                </div>
                <div className='flex-grow-1 flex flex-column align-items-center justify-content-center'>
                    <img 
                        alt={`${title} logo`} 
                        src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                        height="50" 
                        className="mb-3 border-circle shadow-2"
                    />
                    <p className="m-0 text-center font-bold text-900 uppercase text-overflow-ellipsis overflow-hidden white-space-nowrap w-full px-2">
                        {title}
                    </p>
                </div>
            </div>
            <OverlayPanel 
                ref={op} 
                className="min-w-max max-w-20rem shadow-5"
            >
                <p className="m-0 line-height-3 text-700">{description}</p>
            </OverlayPanel>
        </Card>
    )
}

WebsiteCard.displayName = 'WebsiteCard';

export default WebsiteCard;