import React from 'react';
import { Card } from 'primereact/card';

interface AddCardProps {
    onClick: () => void;
}

const AddCard: React.FC<AddCardProps> = ({ onClick }) => {
    return (
        <Card className="h-10rem cursor-pointer shadow-2 hover:shadow-8 transition-all transition-duration-300 flex align-items-center justify-content-center h-full" onClick={onClick}>
            <div className="border-circle" style={{ height: "60px", maxWidth: "60px" }}>
                <i className={`pi pi-plus-circle`} style={{fontSize: "60px"}}></i>
            </div>
        </Card>
    )
}

AddCard.displayName = 'AddCard';

export default AddCard;