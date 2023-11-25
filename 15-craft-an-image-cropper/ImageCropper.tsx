import * as React from 'react';
import { mergeRefs } from './mergeRefs';
import { useDraggable } from './useDraggable';
import { useResizable } from './useResizable';

export const ImageCropper = ({ imageUrl }) => {
    const containerRef = React.useRef();
    const originalImageRef = React.useRef();
    const previewImageRef = React.useRef();
    const [draggableRef, dx, dy] = useDraggable();
    const [resizableRef] = useResizable();

    const croppingAreaRef = React.useRef();
    const ref = mergeRefs([croppingAreaRef, draggableRef, resizableRef]);

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

    const handleSaveImage = () => {
        const img = originalImageRef.current;
        const croppingArea = croppingAreaRef.current;
        if (!img || !croppingArea) {
            return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const scale = img.naturalWidth / img.width;
        const croppingRect = croppingArea.getBoundingClientRect();
        const scaledWidth = croppingRect.width * scale;
        const scaledHeight = croppingRect.height * scale;
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        // Draw cropped image onto canvas
        ctx.drawImage(img, dx * scale, dy * scale, scaledWidth, scaledHeight, 0, 0, scaledWidth, scaledHeight);

        // Save image as file
        const link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.download = "cropped-image.png";

        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <>
            <div className="cropper" ref={containerRef}>
                <div className="cropper__image">
                    <img
                        src={imageUrl}
                        ref={originalImageRef}
                        onLoad={handleImageLoad}
                    />
                </div>
                <div className="cropper__overlay" />
                <div className="cropper__cropping" ref={ref}>
                    <div className="cropper__preview">
                        <img
                            src={imageUrl}
                            ref={previewImageRef}
                            style={{
                                transform: `translate(${-dx}px, ${-dy}px)`,
                            }}
                        />
                    </div>
                    <div className="resizer resizer--r"/>
                    <div className="resizer resizer--b" />
                </div>
            </div>
            <button className="cropper__button" type="button" onClick={handleSaveImage}>Crop</button>
        </>
    );
};
