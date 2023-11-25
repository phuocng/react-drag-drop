import * as React from 'react';
import { clamp } from './clamp';

export const useDraggable = ({ step }) => {
    const [node, setNode] = React.useState<HTMLElement>(null);
    const [{ dx, dy }, setOffset] = React.useState({
        dx: 0,
        dy: 0,
    });
    const [{ percentX, percentY }, setPercent] = React.useState({
        percentX: 0,
        percentY: 0,
    });

    const ref = React.useCallback((nodeEle) => {
        setNode(nodeEle);
    }, []);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        const startPos = {
            x: e.clientX - dx,
            y: e.clientY - dy,
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            let dx = e.clientX - startPos.x;
            let dy = e.clientY - startPos.y;

            const parentRect = node.parentElement.getBoundingClientRect();
            const percentX = Math.round(100 * dx / (parentRect.width * step)) * step;
            const percentY = Math.round(100 * dy / (parentRect.height * step)) * step;
            dx = percentX * parentRect.width / 100;
            dy = percentY * parentRect.height / 100;

            setPercent({
                percentX: clamp(percentX, 0, 100),
                percentY: clamp(percentY, 0, 100),
            });
            setOffset({
                dx: clamp(dx, 0, parentRect.width),
                dy: clamp(dy, 0, parentRect.height),
            });
            updateCursor();
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            resetCursor();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [node, dx, dy]);

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];

        const startPos = {
            x: touch.clientX - dx,
            y: touch.clientY - dy,
        };

        const handleTouchMove = (e: React.TouchEvent) => {
            const touch = e.touches[0];
            let dx = touch.clientX - startPos.x;
            let dy = touch.clientY - startPos.y;
            const parentRect = node.parentElement.getBoundingClientRect();
            const percentX = Math.round(100 * dx / (parentRect.width * step)) * step;
            const percentY = Math.round(100 * dy / (parentRect.height * step)) * step;
            dx = percentX * parentRect.width / 100;
            dy = percentY * parentRect.height / 100;

            setPercent({
                percentX: clamp(percentX, 0, 100),
                percentY: clamp(percentY, 0, 100),
            });
            setOffset({
                dx: clamp(dx, 0, parentRect.width),
                dy: clamp(dy, 0, parentRect.height),
            });
            updateCursor();
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            resetCursor();
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }, [node, dx, dy]);

    const updateCursor = () => {
        document.body.style.cursor = 'move';
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
    }, [node, dx, dy]);

    return [ref, dx, dy, percentX, percentY];
};
