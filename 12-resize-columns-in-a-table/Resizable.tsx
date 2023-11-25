import * as React from 'react';

export const Resizable = ({ children }) => {
    const [node, setNode] = React.useState<HTMLElement>(null);

    const ref = React.useCallback((nodeEle) => {
        setNode(nodeEle);
    }, []);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        if (!node) {
            return;
        }

        const parent = node.parentElement;
        const startPos = {
            x: e.clientX,
            y: e.clientY,
        };
        const styles = window.getComputedStyle(parent);
        const w = parseInt(styles.width, 10);
        const h = parseInt(styles.height, 10);

        const handleMouseMove = (e: React.MouseEvent) => {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            parent.style.width = `${w + dx}`;
            updateCursor();
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            resetCursor();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [node]);

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        if (!node) {
            return;
        }
        const parent = node.parentElement;
        const touch = e.touches[0];
        const startPos = {
            x: touch.clientX - dx,
            y: touch.clientY - dy,
        };
        const styles = window.getComputedStyle(parent);
        const w = parseInt(styles.width, 10);
        const h = parseInt(styles.height, 10);

        const handleTouchMove = (e: React.TouchEvent) => {
            const touch = e.touches[0];
            const dx = touch.clientX - startPos.x;
            const dy = touch.clientY - startPos.y;
            parent.style.width = `${w + dx}`;
            updateCursor();
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            resetCursor();
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }, [node]);

    const updateCursor = () => {
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    const resetCursor = () => {
        document.body.style.removeProperty('cursor');
        document.body.style.removeProperty('user-select');
    };

    React.useEffect(() => {
        if (!node) {
            return;
        }
        node.addEventListener("mousedown", handleMouseDown);
        node.addEventListener("touchstart", handleTouchStart);

        return () => {
            node.removeEventListener("mousedown", handleMouseDown);
            node.removeEventListener("touchstart", handleTouchStart);
        };
    }, [node]);

    return children({ ref });
};
