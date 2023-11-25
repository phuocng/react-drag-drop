import * as React from 'react';
import { clamp } from './clamp';

export const Draggable = ({ children, onMove, onMount }) => {
    const [node, setNode] = React.useState<HTMLElement>(null);
    const [{ dx, dy }, setOffset] = React.useState({
        dx: 0,
        dy: 0,
    });

    const ref = React.useCallback((nodeEle) => {
        setNode(nodeEle);
        if (nodeEle && onMount) {
            const parentRect = nodeEle.parentElement.getBoundingClientRect();
            onMount({
                parentWidth: parentRect.width,
                parentHeight: parentRect.height,
                setOffset,
            });
        }
    }, []);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        const startPos = {
            x: e.clientX - dx,
            y: e.clientY - dy,
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            if (!node) {
                return;
            }
            const parent = node.parentElement;
            const parentRect = parent.getBoundingClientRect();
            const parentWidth = parentRect.width;
            const parentHeight = parentRect.height;

            let dx = e.clientX - startPos.x;
            let dy = e.clientY - startPos.y;
            dx = clamp(dx, 0, parentWidth);
            dy = clamp(dy, 0, parentHeight);

            setOffset({ dx, dy });
            onMove({ dx, dy, parentWidth, parentHeight });
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
            if (!node) {
                return;
            }
            const touch = e.touches[0];
            const parent = node.parentElement;
            const parentRect = parent.getBoundingClientRect();
            const parentWidth = parentRect.width;
            const parentHeight = parentRect.height;

            let dx = touch.clientX - startPos.x;
            let dy = touch.clientY - startPos.y;
            dx = clamp(dx, 0, parentWidth);
            dy = clamp(dy, 0, parentHeight);

            setOffset({ dx, dy });
            onMove({ dx, dy, parentWidth, parentHeight });
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

    return children({ ref, dx, dy });
};
