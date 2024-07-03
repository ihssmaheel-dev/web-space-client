import React, { useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Card } from 'primereact/card';
import ImageComponent from './ImageComponent';

type ImageType = "icon" | "image";

interface WebsiteCardProps {
    title: string;
    description: string;
    imageUrl?: string;
    imageType?: ImageType;  
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ title, description, imageUrl, imageType }) => {
    const op = useRef<OverlayPanel>(null);

    const handleMouseEnter = (e: React.MouseEvent) => op.current?.show(e, e.currentTarget);
    const handleMouseLeave = () => op.current?.hide();

    return (
        <Card className="h-10rem cursor-pointer shadow-2 hover:shadow-8 transition-all transition-duration-300">
            <div className="flex flex-column h-full">
                <div className="text-right mb-2">
                    <i 
                        className={`pi ${description && "pi-info-circle"} text-500 hover:text-primary cursor-pointer transition-colors transition-duration-300`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    ></i>
                </div>
                <div className='flex-grow-1 flex flex-column align-items-center justify-content-center'>
                    <ImageComponent image={imageUrl} imageType={imageType}/>
                    <p className="m-0 text-center font-semibold uppercase text-overflow-ellipsis overflow-hidden white-space-nowrap w-full px-2 mt-2">
                        {title}
                    </p>
                </div>
            </div>
            {
                description && (
                    <OverlayPanel 
                        ref={op} 
                        className="min-w-max max-w-20rem shadow-5"
                    >
                        <p className="m-0 line-height-3 text-700">{description}</p>
                    </OverlayPanel>
                )
            }
        </Card>
    )
}

WebsiteCard.displayName = 'WebsiteCard';

export default WebsiteCard;