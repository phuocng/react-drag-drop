import * as React from 'react';
import { useDraggable } from './useDraggable';

export const Magnifier = ({ imageUrl }) => {
    const ZOOM = 3;

    const containerRef = React.useRef();
    const [glassRef, dx, dy] = useDraggable();
    const [{ imageWidth, imageHeight }, setImageSize] = React.useState({
        imageWidth: 0,
        imageHeight: 0,
    });

    const handleImageLoad = (e) => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const naturalWidth = e.target.naturalWidth;
        const naturalHeight = e.target.naturalHeight;
        const ratio = naturalWidth / naturalHeight;

        const imageWidth = container.getBoundingClientRect().width;
        const imageHeight = imageWidth / ratio;

        setImageSize({ imageWidth, imageHeight });
    };

    return (
        <div
            className="magnifier"
            ref={containerRef}
            style={{
                width: imageWidth === 0 ? '' : `${imageWidth}px`,
                height: imageHeight === 0 ? '' : `${imageHeight}px`,
            }}
        >
            <div className="magnifier__image">
                <img
                    src={imageUrl}
                    onLoad={handleImageLoad}
                    style={{
                        width: imageWidth === 0 ? '' : `${imageWidth}px`,
                    }}
                />
            </div>
            <div
                className="magnifier__glass"
                ref={glassRef}
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `${-dx * ZOOM}px ${-dy * ZOOM}px`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${ZOOM * imageWidth}px ${ZOOM * imageHeight}px`,
                    transform: `translate3d(${dx}px, ${dy}px, 0)`,
                }}
            />
        </div>
    );
};
