import * as React from 'react';
import './styles.css';
import { useDraggable } from './useDraggable';

export default App = () => {
    const [draggableRef, dx, dy] = useDraggable();
    return (
        <div className="container">
            <div
                className="draggable"
                ref={draggableRef}
                style={{
                    transform: `translate(${dx}px, ${dy}px)`,
                }}
            />
        </div>
    );
};
