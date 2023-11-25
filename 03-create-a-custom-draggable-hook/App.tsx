import * as React from 'react';
import './styles.css';
import { useDraggable } from './useDraggable';

export default App = () => {
    const [ref] = useDraggable();
    return (
        <div className="container">
            <div className="draggable" ref={ref}>
                Drag me
            </div>
        </div>
    );
};
