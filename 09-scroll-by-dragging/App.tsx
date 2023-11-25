import * as React from 'react';
import './styles.css';
import { useDragScroll } from './useDragScroll';

export default App = () => {
    const [ref] = useDragScroll();

    return (
        <div ref={ref} className="container">
            <div className="item">1</div>
            <div className="item">2</div>
            <div className="item">3</div>
            <div className="item">4</div>
            <div className="item">5</div>
            <div className="item">6</div>
            <div className="item">7</div>
            <div className="item">8</div>
            <div className="item">9</div>
            <div className="item">10</div>
        </div>
    );
};
