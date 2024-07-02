import React, { useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';

interface WebsiteCardProps {
    title: string
    description: string;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ title, description }) => {
    const op = useRef<OverlayPanel>(null);

    return (
        <div className="custom-card h-10rem p-2 cursor-pointer border-round-md shadow-1 bg-white relative">
            <div className="text-right">
                <i className="pi pi-info-circle text-primary" onClick={(e) => op.current && op.current.toggle(e)}></i>
            </div>
            <p className="m-0 p-0 flex justify-content-center align-items-center absolute top-50 left-50 card-content text-base font-bold uppercase" style={{transform: 'translate(-50%, -50%)'}}>
                {title}
            </p>
            <OverlayPanel ref={op} className='w-4'>
                <p>{description}</p>
            </OverlayPanel>
        </div>
    )
}

export default WebsiteCard