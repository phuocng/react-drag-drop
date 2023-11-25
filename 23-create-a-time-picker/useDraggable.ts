import * as React from 'react';

export const useDraggable = ({ initialAngle }) => {
    const [node, setNode] = React.useState<HTMLElement>();
    const [angle, setAngle] = React.useState(initialAngle);
    const [{ dx, dy }, setOffset] = React.useState({
        dx: 0,
        dy: 0,
    });

    const ref = React.useCallback((node) => {
        setNode(node);
    }, []);

    React.useEffect(() => {
        if (!node) {
            return;
        }
        const width = node.getBoundingClientRect().width;
        const containerWidth = node.parentElement.getBoundingClientRect().width;
        const radius = containerWidth / 2;
        const center = radius - width / 2;
        const radians = initialAngle * Math.PI * 2 - Math.PI / 2;
        const dx = center + radius * Math.cos(radians);
        const dy = center + radius * Math.sin(radians);
        setOffset({ dx, dy });
    }, [node]);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        if (!node) {
            return;
        }
        const startPos = {
            x: e.clientX - dx,
            y: e.clientY - dy,
        };

        const width = node.getBoundingClientRect().width;
        const containerWidth = node.parentElement.getBoundingClientRect().width;
        const radius = containerWidth / 2;
        const center = radius - width / 2;

        const handleMouseMove = (e: React.MouseEvent) => {
            let dx = e.clientX - startPos.x;
            let dy = e.clientY - startPos.y;

            const centerDistance = Math.sqrt(
                Math.pow(dx - center, 2) + Math.pow(dy - center, 2)
            );
            const sinValue = (dy - center) / centerDistance;
            const cosValue = (dx - center) / centerDistance;
            dx = center + radius * cosValue;
            dy = center + radius * sinValue;

            const radians = Math.atan2(dy - center, dx - center);
            const angle = (radians + Math.PI / 2) / (2 * Math.PI);
            setAngle(angle > 0 ? angle : 1 + angle);

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
        if (!node) {
            return;
        }
        const touch = e.touches[0];

        const startPos = {
            x: touch.clientX - dx,
            y: touch.clientY - dy,
        };
        const width = node.getBoundingClientRect().width;
        const containerWidth = node.parentElement.getBoundingClientRect().width;
        const radius = containerWidth / 2;
        const center = radius - width / 2;

        const handleTouchMove = (e: React.TouchEvent) => {
            const touch = e.touches[0];
            let dx = touch.clientX - startPos.x;
            let dy = touch.clientY - startPos.y;
            const centerDistance = Math.sqrt(
                Math.pow(dx - center, 2) + Math.pow(dy - center, 2)
            );
            const sinValue = (dy - center) / centerDistance;
            const cosValue = (dx - center) / centerDistance;
            dx = center + radius * cosValue;
            dy = center + radius * sinValue;

            const radians = Math.atan2(dy - center, dx - center);
            const angle = (radians + Math.PI / 2) / (2 * Math.PI);
            setAngle(angle > 0 ? angle : 1 + angle);

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

    return [ref, dx, dy, angle];
};
