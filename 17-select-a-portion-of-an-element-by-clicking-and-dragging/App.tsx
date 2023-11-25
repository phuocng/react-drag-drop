import * as React from 'react';
import './styles.css';
import { Selection, useClickToSelect } from './useClickToSelect';

export default App = () => {
    const [clickToSelectRef, dx, dy, startX, startY, selection] = useClickToSelect();

    return (
        <div className="container" ref={clickToSelectRef}>
        {selection === Selection.Dragging && (
            <div
                className="selection"
                style={{
                    transform: `translate(${startX}px, ${startY}px)`,
                    width: `${dx}px`,
                    height: `${dy}px`,
                }}
            />
        )}
        </div>
    );
};
