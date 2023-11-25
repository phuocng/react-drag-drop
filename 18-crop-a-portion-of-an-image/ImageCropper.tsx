import * as React from 'react';
import { mergeRefs } from './mergeRefs';
import { useClickToSelect } from './useClickToSelect';
import { useDraggable } from './useDraggable';
import { useResizable } from './useResizable';

export const ImageCropper = ({ imageUrl }) => {
    const containerRef = React.useRef();
    const originalImageRef = React.useRef();

    const [clickToSelectRef, dx, dy, startX, startY, selection] = useClickToSelect();
    const [draggableRef, dragX, dragY, setOffset] = useDraggable();
    const [resizableRef] = useResizable();

    const croppingAreaRef = React.useRef();
    const containerMergedRef = mergeRefs([containerRef, clickToSelectRef]);
    const croppingMergedRef = mergeRefs([croppingAreaRef, draggableRef, resizableRef]);

    const [{ imageWidth, imageHeight }, setImageSize] = React.useState({
        imageWidth: 0,
        imageHeight: 0,
    });

    React.useEffect(() => {
        setOffset({
            dx: startX,
            dy: startY,
        });
    }, [startX, startY]);

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
        ctx.drawImage(img, dragX * scale, dragY * scale, scaledWidth, scaledHeight, 0, 0, scaledWidth, scaledHeight);

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
            <div
                className="cropper"
                ref={containerMergedRef}
                style={{
                    width: imageWidth === 0 ? '' : `${imageWidth}px`,
                    height: imageHeight === 0 ? '' : `${imageHeight}px`,
                }}
            >
                <div className="cropper__image">
                    <img
                        src={imageUrl}
                        ref={originalImageRef}
                        onLoad={handleImageLoad}
                        style={{
                            width: imageWidth === 0 ? '' : `${imageWidth}px`,
                        }}
                    />
                </div>
                <div className="cropper__overlay" />
                {selection === Selection.Dragging && (
                    <div
                        className="cropper__selection"
                        style={{
                            transform: `translate(${startX}px, ${startY}px)`,
                            width: `${dx}px`,
                            height: `${dy}px`,
                        }}
                    />
                )}
                {selection === Selection.Selected && (
                    <div
                        ref={croppingMergedRef}
                        className="cropper__cropping"
                        style={{
                            transform: `translate(${dragX}px, ${dragY}px)`,
                            width: `${dx}px`,
                            height: `${dy}px`,
                        }}
                    >
                        <div className="cropper__preview">
                            <img
                                src={imageUrl}
                                style={{
                                    transform: `translate(${-dragX}px, ${-dragY}px)`,
                                    width: imageWidth === 0 ? '' : `${imageWidth}px`,
                                }}
                            />
                        </div>

                        <div className="resizer resizer--r"/>
                        <div className="resizer resizer--b" />
                    </div>
                )}
            </div>
            <button className="cropper__button" type="button" onClick={handleSaveImage}>Crop</button>
        </>
    );
};
