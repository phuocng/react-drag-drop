import * as React from 'react';
import './styles.css';
import { useResizable } from './useResizable';

export default App = () => {
    const [ref] = useResizable();
    return (
        <div className="resizable" ref={ref}>
            <div className="resizer resizer--r"/>
            <div className="resizer resizer--b" />
        </div>
    );
};
