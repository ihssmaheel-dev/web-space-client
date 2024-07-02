import React from 'react'

const CustomCard: React.FC = ({ children }) => {
    return (
        <div className="custom-card h-10rem p-2 border-round-md shadow-1 bg-white relative">
            <div className="m-0 p-0 text-right info-icon">
                <i className="pi pi-info-circle"></i>
            </div>
            <div className="m-0 p-0 flex justify-content-center align-items-center absolute top-50 right-50 text-center card-content">
                {children}
            </div>
        </div>
    )
}

export default CustomCard