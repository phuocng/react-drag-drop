import * as React from 'react';

export const RangeSlider = ({ onChange }) => {
    const containerRef = React.useRef();
    const firstHalfRef = React.useRef();
    const secondHalfRef = React.useRef();
    const knobRef = React.useRef();

    const MIN = 0;
    const MAX = 255;
    const [value, setValue] = React.useState(0);

    const [{ dx, dy }, setOffset] = React.useState({
        dx: 0,
        dy: 0,
    });

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        const startPos = {
            x: e.clientX - dx,
            y: e.clientY - dy,
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            setOffset({ dx, dy });
            updatePosition(dx);
            updateCursor();
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            resetCursor();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [dx, dy]);

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];

        const startPos = {
            x: touch.clientX - dx,
            y: touch.clientY - dy,
        };

        const handleTouchMove = (e: React.TouchEvent) => {
            const touch = e.touches[0];
            const dx = touch.clientX - startPos.x;
            const dy = touch.clientY - startPos.y;
            setOffset({ dx, dy });
            updatePosition(dx);
            updateCursor();
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            resetCursor();
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }, [dx, dy]);

    const updatePosition = (dx) => {
        const container = containerRef.current;
        const firstHalfEle = firstHalfRef.current;
        const knobEle = knobRef.current;

        if (!container || !firstHalfEle || !knobEle) {
            return;
        }

        const containerWidth = container.getBoundingClientRect().width;
        const delta = Math.min(Math.max(0, dx), containerWidth);
        const percent = delta / containerWidth;
        const value = Math.ceil(MIN + (MAX - MIN) * percent);
        setValue(value);
        onChange(value);

        knobEle.style.transform = `translate3d(${delta}px, 0, 0)`;
        firstHalfEle.style.width = `${100 * percent}%`;
    };

    const updateCursor = () => {
        const container = containerRef.current;
        const firstHalfEle = firstHalfRef.current;
        const knobEle = knobRef.current;
        const secondHalfEle = secondHalfRef.current;

        if (!container || !firstHalfEle || !knobEle || !secondHalfEle) {
            return;
        }

        knobEle.style.cursor = 'move';
        document.body.style.cursor = 'move';
        firstHalfEle.style.userSelect = 'none';
        firstHalfEle.style.pointerEvents = 'none';
        secondHalfEle.style.userSelect = 'none';
        secondHalfEle.style.pointerEvents = 'none';
    };

    const resetCursor = () => {
        const container = containerRef.current;
        const firstHalfEle = firstHalfRef.current;
        const knobEle = knobRef.current;
        const secondHalfEle = secondHalfRef.current;

        if (!container || !firstHalfEle || !knobEle || !secondHalfEle) {
            return;
        }

        knobEle.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');
        firstHalfEle.style.removeProperty('user-select');
        firstHalfEle.style.removeProperty('pointer-events');
        secondHalfEle.style.removeProperty('user-select');
        secondHalfEle.style.removeProperty('pointer-events');
    };

    return (
        <div className="slider" ref={containerRef}>
            <div className="slider__first" ref={firstHalfRef} />
            <div
                className="slider__knob"
                ref={knobRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="slider__value">{value}</div>
            </div>
            <div className="slider__second" ref={secondHalfRef} />
        </div>
    );
};
