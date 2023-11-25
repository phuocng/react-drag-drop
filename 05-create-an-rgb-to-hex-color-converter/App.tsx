import * as React from 'react';
import { RangeSlider } from './RangeSlider';
import { rgbToHex } from './rgbToHex';
import './styles.css';

export default App = () => {
    const [{r, g, b}, setRgb] = React.useState({
        r: 0,
        g: 0,
        b: 0,
    });
    const [hex, setHex] = React.useState('');

    const handleChangeR = (r) => {
        setRgb((rgb) => ({ ...rgb, r }));
    };
    const handleChangeG = (g) => {
        setRgb((rgb) => ({ ...rgb, g }));
    };
    const handleChangeB = (b) => {
        setRgb((rgb) => ({ ...rgb, b }));
    };

    const handleFocusHex = (e) => {
        e.target.select();
    };

    React.useEffect(() => {
        setHex(rgbToHex(r, g, b));
    }, [r, g, b]);

    return (
        <div className="converter">
            <div className="converter__item">
                <div className="converter__prop">R</div>
                <RangeSlider onChange={handleChangeR} />
            </div>

            <div className="converter__item">
                <div className="converter__prop">G</div>
                <RangeSlider onChange={handleChangeG} />
            </div>

            <div className="converter__item">
                <div className="converter__prop">B</div>
                <RangeSlider onChange={handleChangeB} />
            </div>

            <div className="converter__item">
                <div className="converter__prop">Hex</div>
                <input
                    className="converter__hex"
                    defaultValue={hex}
                    readOnly
                    type="text"
                    onFocus={handleFocusHex}
                />
            </div>
        </div>
    );
};
