import * as React from 'react';
import { AddNewAnnotation } from './AddNewAnnotation';
import { Annotation } from './Annotation';
import { generateId } from './generateId';
import { mergeRefs } from './mergeRefs';
import { Selection, useClickToSelect } from './useClickToSelect';
import { useDraggable } from './useDraggable';
import { useResizable } from './useResizable';
import { useWatchSize } from './useWatchSize';

export const ImageAnnotator = ({ imageUrl }) => {
    const containerRef = React.useRef();

    const [clickToSelectRef, dx, dy, startX, startY, selection, setSelection] = useClickToSelect();
    const [draggableRef, dragX, dragY, setOffset] = useDraggable();
    const [watchSizeRef, w, h] = useWatchSize();
    const [resizableRef] = useResizable();

    const containerMergedRef = mergeRefs([containerRef, clickToSelectRef]);
    const croppingMergedRef = mergeRefs([draggableRef, resizableRef, watchSizeRef]);

    const [{ imageWidth, imageHeight }, setImageSize] = React.useState({
        imageWidth: 0,
        imageHeight: 0,
    });
    const [annotations, setAnnotations] = React.useState([]);

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

    const handleAddAnnotation = (text) => {
        setAnnotations((annotations) => ([
            ...annotations,
            {
                id: generateId(6),
                text,
                x: dragX,
                y: dragY,
                w,
                h,
            },
        ]));
        setSelection(Selection.None);
    };

    const handleCancelAnnotation = () => setSelection(Selection.None);

    return (
        <div className="annotator">
            <div
                className="annotator__cropper"
                ref={containerMergedRef}
                style={{
                    width: imageWidth === 0 ? '' : `${imageWidth}px`,
                    height: imageHeight === 0 ? '' : `${imageHeight}px`,
                }}
            >
                <div className="annotator__image">
                    <img
                        src={imageUrl}
                        onLoad={handleImageLoad}
                        style={{
                            width: imageWidth === 0 ? '' : `${imageWidth}px`,
                        }}
                    />
                </div>
                <div className="annotator__overlay" />
                {selection === Selection.Dragging && (
                    <div
                        className="annotator__selection"
                        style={{
                            transform: `translate(${startX}px, ${startY}px)`,
                            width: `${dx}px`,
                            height: `${dy}px`,
                        }}
                    />
                )}
                {dx > 0 && dy > 0 && selection === Selection.Selected && (
                    <div
                        ref={croppingMergedRef}
                        className="annotator__cropping"
                        style={{
                            transform: `translate(${dragX}px, ${dragY}px)`,
                            width: `${dx}px`,
                            height: `${dy}px`,
                        }}
                    >
                        <div className="annotator__preview">
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

            {dx > 0 && dy > 0 && selection === Selection.Selected && (
                <div
                    className="annotator__popover"
                    style={{
                        transform: `translate(${dragX}px, ${dragY + h + 8}px)`,
                    }}
                >
                    <AddNewAnnotation
                        onAddAnnotation={handleAddAnnotation}
                        onCancel={handleCancelAnnotation}
                    />
                </div>
            )}
            {
                annotations.map((annotation) => <Annotation annotation={annotation} key={annotation.id} />)
            }
        </div>
    );
};
