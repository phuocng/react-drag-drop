import * as React from 'react';

export const ImageComparison = ({ firstImageUrl, secondImageUrl }) => {
    const containerRef = React.useRef();
    const firstHalfRef = React.useRef();
    const secondHalfRef = React.useRef();
    const resizerRef = React.useRef();

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        const startPos = {
            x: e.clientX,
            y: e.clientY,
        };
        const currentLeftWidth = parseFloat(window.getComputedStyle(resizerRef.current).left);

        const handleMouseMove = (e: React.MouseEvent) => {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            updateWidth(currentLeftWidth, dx);
            updateCursor();
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            resetCursor();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        const startPos = {
            x: touch.clientX,
            y: touch.clientY,
        };
        const currentLeftWidth = parseFloat(window.getComputedStyle(resizerRef.current).left);

        const handleTouchMove = (e: React.TouchEvent) => {
            const touch = e.touches[0];
            const dx = touch.clientX - startPos.x;
            const dy = touch.clientY - startPos.y;
            updateWidth(currentLeftWidth, dx);
            updateCursor();
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            resetCursor();
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }, []);

    const updateWidth = (currentLeftWidth, dx) => {
        const container = containerRef.current;
        const firstHalfEle = firstHalfRef.current;
        const resizerEle = resizerRef.current;

        if (!container || !firstHalfEle || !resizerEle) {
            return;
        }

        const containerWidth = container.getBoundingClientRect().width;
        const delta = currentLeftWidth + dx;
        const newFirstHalfWidth = delta * 100 / containerWidth;
        const normalizedWidth = Math.min(Math.max(0, newFirstHalfWidth), 100);

        firstHalfEle.style.clipPath = `inset(0 0 0 ${normalizedWidth}%)`;
        resizerEle.style.left = `${normalizedWidth}%`;
    };

    const updateCursor = () => {
        const container = containerRef.current;
        const firstHalfEle = firstHalfRef.current;
        const resizerEle = resizerRef.current;
        const secondHalfEle = secondHalfRef.current;

        if (!container || !firstHalfEle || !resizerEle || !secondHalfEle) {
            return;
        }

        resizerEle.style.cursor = 'ew-resize';
        document.body.style.cursor = 'ew-resize';
        firstHalfEle.style.userSelect = 'none';
        firstHalfEle.style.pointerEvents = 'none';
        secondHalfEle.style.userSelect = 'none';
        secondHalfEle.style.pointerEvents = 'none';
    };

    const resetCursor = () => {
        const container = containerRef.current;
        const firstHalfEle = firstHalfRef.current;
        const resizerEle = resizerRef.current;
        const secondHalfEle = secondHalfRef.current;

        if (!container || !firstHalfEle || !resizerEle || !secondHalfEle) {
            return;
        }

        resizerEle.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');
        firstHalfEle.style.removeProperty('user-select');
        firstHalfEle.style.removeProperty('pointer-events');
        secondHalfEle.style.removeProperty('user-select');
        secondHalfEle.style.removeProperty('pointer-events');
    };

    return (
        <div className="comparison" ref={containerRef}>
            <div className="comparison__first" ref={firstHalfRef}>
                <img className="comparison__image" src={firstImageUrl} />
            </div>
            <div
                className="comparison__resizer"
                ref={resizerRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            />
            <img
                className="comparison__image"
                src={secondImageUrl}
                ref={secondHalfRef}
            />
        </div>
    );
};
