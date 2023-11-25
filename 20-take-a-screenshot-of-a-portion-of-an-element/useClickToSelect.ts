import * as React from 'react';
import { clamp } from './clamp';

export enum Selection {
    None = 'None',
    Clicked = 'Clicked',
    Dragging = 'Dragging',
    Selected = 'Selected',
};

export const useClickToSelect = () => {
    const [selection, setSelection] = React.useState(Selection.None);
    const [node, setNode] = React.useState<HTMLElement>();
    const [{ dx, dy }, setOffset] = React.useState({
        dx: 0,
        dy: 0,
    });
    const [{ startX, startY}, setStartPosition] = React.useState({
        startX: 0,
        startY: 0,
    });

    const ref = React.useCallback((nodeEle) => {
        setNode(nodeEle);
    }, []);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        if (!node) {
            return;
        }
        const eleRect = node.getBoundingClientRect();
        const startRelativePos = {
            startX: e.clientX - eleRect.left,
            startY: e.clientY - eleRect.top,
        };
        setOffset({ dx: 0, dy: 0 });
        setStartPosition(startRelativePos);
        const startPos = {
            x: e.clientX,
            y: e.clientY,
        };
        setSelection(Selection.Clicked);

        const handleMouseMove = (e: React.MouseEvent) => {
            let dx = e.clientX - startPos.x;
            let dy = e.clientY - startPos.y;
            const maxX = eleRect.width - startRelativePos.startX;
            const maxY = eleRect.height - startRelativePos.startY;
            dx = clamp(dx, 0, maxX);
            dy = clamp(dy, 0, maxY);

            setOffset({ dx, dy });
            setSelection(Selection.Dragging);
            updateCursor();
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setSelection(Selection.Selected);
            resetCursor();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [node, dx, dy]);

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        if (!node) {
            return;
        }
        const touch = e.touches[0];

        const eleRect = node.getBoundingClientRect();
        const startRelativePos = {
            startX: touch.clientX - eleRect.left,
            startY: touch.clientY - eleRect.top,
        };
        setOffset({ dx: 0, dy: 0 });
        setStartPosition(startRelativePos);
        const startPos = {
            x: touch.clientX,
            y: touch.clientY,
        };
        setSelection(Selection.Clicked);

        const handleTouchMove = (e: React.TouchEvent) => {
            if (!node) {
                return;
            }
            const touch = e.touches[0];
            let dx = touch.clientX - startPos.x;
            let dy = touch.clientY - startPos.y;
            const maxX = eleRect.width - startRelativePos.startX;
            const maxY = eleRect.height - startRelativePos.startY;
            dx = clamp(dx, 0, maxX);
            dy = clamp(dy, 0, maxY);

            setOffset({ dx, dy });
            setSelection(Selection.Dragging);
            updateCursor();
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            setSelection(Selection.Selected);
            resetCursor();
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }, [node, dx, dy]);

    const updateCursor = () => {
        document.body.style.cursor = 'crosshair';
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

    return [ref, dx, dy, startX, startY, selection];
};
