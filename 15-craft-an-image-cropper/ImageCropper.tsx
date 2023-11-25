import * as React from 'react';
import { useDraggable } from './useDraggable';

export const ImageCropper = ({ imageUrl }) => {
    const containerRef = React.useRef();
    const previewImageRef = React.useRef();
    const [draggableRef, dx, dy] = useDraggable();

    const handleImageLoad = (e) => {
        const container = containerRef.current;
        const previewImage = previewImageRef.current;
        if (!container) {
            return;
        }
        const naturalWidth = e.target.naturalWidth;
        const naturalHeight = e.target.naturalHeight;
        const ratio = naturalWidth / naturalHeight;

        const containerWidth = container.getBoundingClientRect().width;
        container.style.height = `${containerWidth / ratio}px`;
        e.target.style.width = `${containerWidth}px`;
        previewImage.style.width = `${containerWidth}px`;
    };

    return (
        <div className="cropper" ref={containerRef}>
            <div className="cropper__image">
                <img src={imageUrl} onLoad={handleImageLoad} />
            </div>
            <div className="cropper__overlay" />
            <div className="cropper__cropping" ref={draggableRef}>
                <div className="cropper__preview">
                    <img
                        src={imageUrl}
                        ref={previewImageRef}
                        style={{
                            transform: `translate(${-dx}px, ${-dy}px)`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
