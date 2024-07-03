import React, { useRef } from 'react';
import { Card } from 'primereact/card';

interface AddCardProps {
    
}

const AddCard: React.FC<AddCardProps> = () => {
    return (
        <Card className="h-10rem cursor-pointer shadow-2 hover:shadow-8 transition-all transition-duration-300 flex align-items-center justify-content-center h-full">
            <div className="border-circle" style={{ height: "60px", maxWidth: "60px" }}>
                <i className={`pi pi-plus-circle`} style={{fontSize: "60px"}}></i>
            </div>
        </Card>
    )
}

AddCard.displayName = 'AddCard';

export default AddCard;