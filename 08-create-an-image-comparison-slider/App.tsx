import * as React from 'react';
import { ImageComparison } from './ImageComparison';
import './styles.css';

export default App = () => {
    return (
        <ImageComparison
            firstImageUrl="/assets/react-drag-drop/city-day.jpg"
            secondImageUrl="/assets/react-drag-drop/city-night.jpg"
        />
    );
};
