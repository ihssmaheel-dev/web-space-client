import React from 'react';
import useTheme from '../hooks/useTheme';

interface ImageProps {
    image?: string;
    imageType?: 'icon' | 'image';
}

const ImageComponent: React.FC<ImageProps> = ({ image, imageType }) => {
    const { theme } = useTheme();

    const defaultIcon = 'pi-globe';
    const defaultImage = theme === 'theme-light' ?  '/public/default_web_logo_light.png' : '/public/default_web_logo_dark.png';

    return (
        <div className="mb-3 border-circle h-3rem w-3rem">
            {imageType === 'image' ? (
                <img 
                    src={image || defaultImage} 
                    style={{ objectFit: 'contain', height: '100%', width: '100%' }} 
                    height="50" 
                    className="border-circle"  
                    alt="logo" 
                />
            ) : (
                <i className={`pi ${image || defaultIcon} text-6xl`}></i>
            )}
        </div>
    );
};

export default ImageComponent;
