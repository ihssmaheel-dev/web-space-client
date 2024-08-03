import React from 'react';
import { Skeleton } from 'primereact/skeleton';

const SkeletonWebsiteCard = () => {
    const skeletonCount = 6;

    return (
        <div className="grid pt-3">
            {Array.from({ length: skeletonCount }).map((_, index) => (
                <div className="col-2" key={index}>
                    <Skeleton height='10rem' />
                </div>
            ))}
        </div>
    );
};

export default SkeletonWebsiteCard;
