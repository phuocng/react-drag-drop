import * as React from 'react';
import { useClickOutside } from './useClickOutside';

export const Annotation = ({ annotation }) => {
    const [ref, isOpen] = useClickOutside();

    return (
        <div
            className="annotator__annotation"
            ref={ref}
            style={{
                transform: `translate(${annotation.x}px, ${annotation.y}px)`,
                width: `${annotation.w}px`,
                height: `${annotation.h}px`,
            }}
        >
            {isOpen && (
                <div
                    className="annotator__popover"
                    style={{
                        transform: `translateY(${annotation.h + 8}px)`,
                    }}
                >
                    {annotation.text}
                </div>
            )}
        </div>
    );
};
