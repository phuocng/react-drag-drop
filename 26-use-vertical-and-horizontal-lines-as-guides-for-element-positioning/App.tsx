import * as React from 'react';
import './styles.css';
import { useDraggable } from './useDraggable';

export default App = () => {
    const [ref, dx, dy, highlightHorizontal, highlightVertical] = useDraggable();

    return (
        <div
            className={`container ${highlightHorizontal ? 'container--horizontal' : ''} ${highlightVertical ? 'container--vertical' : ''}`}
        >
            <div
                className="draggable"
                ref={ref}
                style={{
                    transform: `translate(${dx}px, ${dy}px)`,
                }}
            >
                Drag me
            </div>
        </div>
    );
};
