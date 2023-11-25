import * as React from 'react';
import { Draggable } from './Draggable';
import { hsvToRgb } from './hsvToRgb';
import { rgbToHex } from './rgbToHex';
import { rgbToHsv } from './rgbToHsv';
import './styles.css';

export default App = () => {
    const initialColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    };
    const hsv = rgbToHsv(initialColor);
    const [color, setColor] = React.useState({
        ...initialColor,
        ...hsv,
    });

    const r = Math.round(color.r);
    const g = Math.round(color.g);
    const b = Math.round(color.b);
    const h = Math.round(color.h);
    const s = Math.round(color.s);
    const v = Math.round(color.v);
    const a = Math.round(color.a * 1000) / 1000;

    const rgbColor = `${r} ${g} ${b}`;
    const rgbaColor = `${r} ${g} ${b} / ${a}`;
    const hslColor = `${h} 100% 50%`;
    const hsvColor = `${h} ${s}% ${v}% ${a}`;
    const hexColor = rgbToHex({ r, g, b, a });

    const handleChangeSaturation = React.useCallback(({ dx, dy, parentWidth, parentHeight }) => {
        const s = 100 * dx / parentWidth;
        const v = 100 * (1 - (dy / parentHeight));
        const rgb = hsvToRgb({
            h: color.h,
            s,
            v,
        });
        setColor({
            ...color,
            ...rgb,
            s,
            v,
        });
    }, [color]);

    const handleMountSaturation = ({ parentWidth, parentHeight, setOffset }) => {
        const dx = color.s * parentWidth;
        const dy = (1 - color.v) * parentHeight;
        setOffset({ dx, dy });
    };

    const handleChangeHue = React.useCallback(({ dx, parentWidth }) => {
        const h = (dx / parentWidth) * 360;
        const rgb = hsvToRgb({
            h,
            s: color.s,
            v: color.v,
        });
        setColor({
            ...color,
            ...rgb,
            h,
        });
    }, [color]);

    const handleMountHue = ({ parentWidth, parentHeight, setOffset }) => {
        const dx = color.h * parentWidth;
        setOffset((offset) => ({
            ...offset,
            dx,
        }));
    };

    const handleChangeAlpha = ({ dx, parentWidth }) => {
        const a = dx / parentWidth;
        setColor({
            ...color,
            a,
        });
    };

    const handleMountAlpha = ({ parentWidth, parentHeight, setOffset }) => {
        const dx = color.a * parentWidth;
        setOffset((offset) => ({
            ...offset,
            dx,
        }));
    };

    return (
        <div className="picker">
            <Draggable onMove={handleChangeSaturation} onMount={handleMountSaturation}>
            {
                ({ ref, dx, dy }) => (
                    <div
                        className="picker__saturation draggable__container"
                        style={{
                            backgroundImage: 'linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, transparent)',
                            backgroundColor: `hsl(${hslColor})`,
                        }}
                    >
                        <div
                            className="draggable"
                            ref={ref}
                            style={{
                                backgroundColor: `rgb(${rgbColor})`,
                                transform: `translate(${dx}px, ${dy}px)`,
                            }}
                        />
                    </div>
                )
            }
            </Draggable>

            <Draggable onMove={handleChangeHue} onMount={handleMountHue}>
            {
                ({ ref, dx, dy }) => (
                    <div
                        className="picker__hue draggable__container"
                        style={{
                            backgroundImage: `linear-gradient(
                                                to right,
                                                rgb(255 0 0),
                                                rgb(255 255 0),
                                                rgb(0 255 0),
                                                rgb(0 255 255),
                                                rgb(0 0 255),
                                                rgb(255 0 255),
                                                rgb(255 0 0)
                                            )`
                        }}
                    >
                        <div
                            className="draggable"
                            ref={ref}
                            style={{
                                backgroundColor: `hsl(${hslColor})`,
                                transform: `translate(${dx}px, 0)`,
                            }}
                        />
                    </div>
                )
            }
            </Draggable>

            <Draggable onMove={handleChangeAlpha} onMount={handleMountAlpha}>
            {
                ({ ref, dx, dy }) => (
                    <div
                        className="picker__alpha draggable__container"
                        style={{
                            background: `linear-gradient(to right, rgb(${rgbColor} / 0), rgb(${rgbColor} / 1)) top left / auto auto,
                                        conic-gradient(#666 0.25turn, #999 0.25turn 0.5turn, #666 0.5turn 0.75turn, #999 0.75turn) top left / 1rem 1rem repeat`,
                        }}
                    >
                        <div
                            className="draggable"
                            ref={ref}
                            style={{
                                background: `linear-gradient(to right, rgb(${rgbaColor}), rgb(${rgbaColor})) top left / auto auto,
                                        conic-gradient(
                                            #666 0.25turn,
                                            #999 0.25turn 0.5turn,
                                            #666 0.5turn 0.75turn,
                                            #999 0.75turn
                                        ) ${-dx - 4}px 2px / 1rem 1rem repeat`,
                                transform: `translate(${dx}px, 0)`,
                            }}
                        />
                    </div>
                )
            }
            </Draggable>

            <div className="picker__output">
                <input
                    readOnly
                    type="text"
                    value={`rgb(${rgbaColor})`}
                />
                <input
                    readOnly
                    type="text"
                    value={hexColor}
                />
                <input
                    readOnly
                    type="text"
                    value={`hsva(${hsvColor})`}
                />
            </div>
        </div>
    );
};
