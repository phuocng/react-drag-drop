import html2canvas from 'html2canvas';
import * as React from 'react';
import { mergeRefs } from './mergeRefs';
import './styles.css';
import { Selection, useClickToSelect } from './useClickToSelect';

export default App = () => {
    const containerRef = React.useRef();
    const [clickToSelectRef, dx, dy, startX, startY, selection] = useClickToSelect();
    const containerMergedRef = mergeRefs([containerRef, clickToSelectRef]);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container || selection !== Selection.Selected || dx === 0 || dy === 0) {
            return;
        }
        html2canvas(container, {
            x: startX,
            y: startY,
            width: dx,
            height: dy,
        }).then((canvas) => {
            const img = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = img;
            link.download = "screenshot.png";

            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    }, [dx, dy, startX, startY, selection]);

    return (
        <div className="container" ref={containerMergedRef}>
            {selection === Selection.Dragging && (
                <div
                    className="selection"
                    style={{
                        transform: `translate(${startX}px, ${startY}px)`,
                        width: `${dx}px`,
                        height: `${dy}px`,
                    }}
                />
            )}
            <p className="playground__placeholder">Fruit female great rule, you'll divide set our great set him firmament. Whales, above. Face given kind years can't. Meat cattle. Whales he. Forth and tree own gathering divide. Rule gathering there in. You'll after, have his given every signs earth one years him darkness night. Meat unto great, spirit fifth Divided. Earth god beginning behold face fruit their and is from set set our don't fowl may day.</p>

            <p className="playground__image" />

            <p className="playground__placeholder">Us fill replenish very they're two days very let gathered whales. Doesn't seed place from fifth heaven life yielding image let. Years stars don't seed replenish bearing. Were creature have days can't greater may and for third, creepeth. One. Beast together. Above firmament all upon without moved. Moveth was kind own won't. Place unto air, man moveth make multiply Midst gathered a. Spirit signs for bring whales spirit blessed given. Isn't seasons appear divided two, gathering itself hath.</p>
        </div>
    );
};
