import * as React from 'react';
import { clamp } from './clamp';

export const useDraggable = () => {
    const [node, setNode] = React.useState<HTMLElement>(null);
    const [{ dx, dy }, setOffset] = React.useState({
        dx: 0,
        dy: 0,
    });

    const ref = React.useCallback((nodeEle) => {
        setNode(nodeEle);
    }, []);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();
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
            const eleRect = node.getBoundingClientRect();

            let dx = e.clientX - startPos.x;
            let dy = e.clientY - startPos.y;
            const maxX = parentRect.width - eleRect.width;
            const maxY = parentRect.height - eleRect.height;
            dx = clamp(dx, 0, maxX);
            dy = clamp(dy, 0, maxY);

            setOffset({ dx, dy });
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
            const eleRect = node.getBoundingClientRect();

            let dx = touch.clientX - startPos.x;
            let dy = touch.clientY - startPos.y;
            const maxX = parentRect.width - eleRect.width;
            const maxY = parentRect.height - eleRect.height;
            dx = clamp(dx, 0, maxX);
            dy = clamp(dy, 0, maxY);

            setOffset({ dx, dy });
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
        if (node) {
            node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        }
    }, [node, dx, dy]);

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

    return [ref, dx, dy];
};
