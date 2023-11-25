import * as React from 'react';
import { clamp } from './clamp';

enum Direction {
    Horizontal = 'Horizontal',
    Vertical = 'Vertical',
}

export const useResizable = () => {
    const [node, setNode] = React.useState<HTMLElement>(null);

    const ref = React.useCallback((nodeEle) => {
        setNode(nodeEle);
    }, []);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!node) {
            return;
        }

        const direction = e.target.classList.contains("resizer--r")
                            ? Direction.Horizontal
                            : Direction.Vertical;
        const startPos = {
            x: e.clientX,
            y: e.clientY,
        };
        const styles = window.getComputedStyle(node);
        const w = parseInt(styles.width, 10);
        const h = parseInt(styles.height, 10);

        const handleMouseMove = (e: React.MouseEvent) => {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;

            const parent = node.parentElement;
            const parentRect = parent.getBoundingClientRect();
            const eleRect = node.getBoundingClientRect();
            const newWidth = clamp(w + dx, 0, parentRect.width - (eleRect.left - parentRect.left));
            const newHeight = clamp(h + dy, 0, parentRect.height - (eleRect.top - parentRect.top));

            direction === Direction.Horizontal
                ? node.style.width = `${newWidth}px`
                : node.style.height = `${newHeight}`;
            updateCursor(direction);
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
        e.stopPropagation();
        if (!node) {
            return;
        }
        const direction = e.target.classList.contains("resizer--r")
                            ? Direction.Horizontal
                            : Direction.Vertical;
        const touch = e.touches[0];
        const startPos = {
            x: touch.clientX,
            y: touch.clientY,
        };

        const styles = window.getComputedStyle(node);
        const w = parseInt(styles.width, 10);
        const h = parseInt(styles.height, 10);

        const handleTouchMove = (e: React.TouchEvent) => {
            const touch = e.touches[0];
            const dx = touch.clientX - startPos.x;
            const dy = touch.clientY - startPos.y;

            const parent = node.parentElement;
            const parentRect = parent.getBoundingClientRect();
            const eleRect = node.getBoundingClientRect();
            const newWidth = clamp(w + dx, 0, parentRect.width - (eleRect.left - parentRect.left));
            const newHeight = clamp(h + dy, 0, parentRect.height - (eleRect.top - parentRect.top));

            direction === Direction.Horizontal
                ? node.style.width = `${newWidth}px`
                : node.style.height = `${newHeight}`;
            updateCursor(direction);
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            resetCursor();
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }, [node]);

    const updateCursor = (direction: Direction) => {
        document.body.style.cursor = direction === Direction.Horizontal ? 'col-resize' : 'row-resize';
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
        const resizerElements = [...node.querySelectorAll('.resizer')];
        resizerElements.forEach((resizerEle) => {
            resizerEle.addEventListener("mousedown", handleMouseDown);
            resizerEle.addEventListener("touchstart", handleTouchStart);
        });

        return () => {
            resizerElements.forEach((resizerEle) => {
                resizerEle.removeEventListener("mousedown", handleMouseDown);
                resizerEle.removeEventListener("touchstart", handleTouchStart);
            });
        };
    }, [node]);

    return [ref];
};
