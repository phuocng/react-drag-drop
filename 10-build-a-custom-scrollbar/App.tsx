import * as React from 'react';
import './styles.css';

export default App = () => {
    const trackRef = React.useRef();
    const thumbRef = React.useRef();
    const contentRef = React.useRef();

    const handleScrollContent = () => {
        const thumbEle = thumbRef.current;
        const contentEle = contentRef.current;
        if (!thumbEle || !contentEle) {
            return;
        }
        thumbEle.style.top = `${(contentEle.scrollTop * 100) / contentEle.scrollHeight}%`;
    };

    const handleClickTrack = (e) => {
        const trackEle = trackRef.current;
        const contentEle = contentRef.current;
        if (!trackEle || !contentEle) {
            return;
        }
        const bound = trackEle.getBoundingClientRect();
        const percentage = (e.clientY - bound.top) / bound.height;
        contentEle.scrollTop = percentage * (contentEle.scrollHeight - contentEle.clientHeight);
    };

    React.useEffect(() => {
        const thumbEle = thumbRef.current;
        const contentEle = contentRef.current;
        if (!thumbEle || !contentEle) {
            return;
        }
        const scrollRatio = contentEle.clientHeight / contentEle.scrollHeight;
        thumbEle.style.height = `${scrollRatio * 100}%`;
    }, []);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        const ele = thumbRef.current;
        const contentEle = contentRef.current;
        if (!ele || !contentEle) {
            return;
        }
        const startPos = {
            top: contentEle.scrollTop,
            x: e.clientX,
            y: e.clientY,
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            const scrollRatio = contentEle.clientHeight / contentEle.scrollHeight;
            contentEle.scrollTop = startPos.top + dy / scrollRatio;
            updateCursor(ele);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            resetCursor(ele);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        const ele = thumbRef.current;
        const contentEle = contentRef.current;
        if (!ele || !contentEle) {
            return;
        }
        const touch = e.touches[0];
        const startPos = {
            top: contentEle.scrollTop,
            x: touch.clientX,
            y: touch.clientY,
        };

        const handleTouchMove = (e: React.TouchEvent) => {
            const touch = e.touches[0];
            const dx = touch.clientX - startPos.x;
            const dy = touch.clientY - startPos.y;
            const scrollRatio = contentEle.clientHeight / contentEle.scrollHeight;
            contentEle.scrollTop = startPos.top + dy / scrollRatio;
            updateCursor(ele);
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            resetCursor(ele);
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }, []);

    const updateCursor = (ele) => {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    };

    const resetCursor = (ele) => {
        ele.style.cursor = 'grab';
        ele.style.userSelect = '';
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    return (
        <div className="container">
            <div
                className="container__content"
                ref={contentRef}
                onScroll={handleScrollContent}
            >
            {
                Array(20).fill(0).map((_, index) => (
                    <p className="playground__placeholder" key={index}>Very seasons dominion set abundantly over. Unto morning years man you night our without. Won't days. Fruitful firmament moveth man fruit, from, day it, gathered second also night given there fly us was whose. Image after you also. Likeness, without second fifth own wherein fifth fourth. Spirit female living together don't evening darkness creeping beginning living own beginning itself brought third face them bring saying creeping green.</p>
                ))
            }
            </div>

            <div className="scrollbar">
                <div
                    className="scrollbar__track"
                    ref={trackRef}
                    onClick={handleClickTrack}
                />
                <div
                    className="scrollbar__thumb"
                    ref={thumbRef}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                />
            </div>
        </div>
    );
};
