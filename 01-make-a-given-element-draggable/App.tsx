import * as React from 'react';
import './styles.css';

export default App = () => {
    const eleRef = React.useRef();
    const [{ dx, dy }, setOffset] = React.useState({
        dx: 0,
        dy: 0,
    });

    const handleMouseDown = (e: React.MouseEvent) => {
        const startPos = {
            x: e.clientX - dx,
            y: e.clientY - dy,
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            const ele = eleRef.current;
            if (!ele) {
                return;
            }

            // How far the mouse has been moved
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;

            // Set the position of element
            ele.style.transform = `translate(${dx}px, ${dy}px)`;

            // Reassign the position of mouse
            setOffset({ dx, dy });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="container">
            <div
                className="draggable"
                ref={eleRef}
                onMouseDown={handleMouseDown}
            >
                Drag me
            </div>
        </div>
    );
};
