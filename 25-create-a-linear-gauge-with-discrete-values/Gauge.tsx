import * as React from 'react';
import { useDraggable } from './useDraggable';

export const Gauge = ({ step }) => {
    const [draggableRef, dx, dy, percentX, percentY] = useDraggable({
        step,
    });

    return (
        <div className="gauge">
            <div
                className="gauge__marker"
                ref={draggableRef}
                style={{
                    transform: `translateY(${dy}px)`,
                }}
            />
            <div
                className="gauge__progress"
                style={{
                    height: `${percentY}%`,
                }}
            />
            {
                Array(21).fill(0)
                    .map((_, index) => index * 5)
                    .map((v) => (
                        v % 20 === 0
                        ? (
                            <div
                                className="gauge__tick"
                                key={v}
                                style={{
                                    top: `${v}%`,
                                }}
                            >
                                <div className="gauge__label">{v}</div>
                            </div>
                        )
                        : (
                            <div
                                className="gauge__tick gauge__tick--minor"
                                key={v}
                                style={{
                                    top: `${v}%`,
                                }}
                            />
                        )
                    ))
            }
        </div>
    );
};
