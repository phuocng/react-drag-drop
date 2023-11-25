import * as React from 'react';
import { useDraggable } from './useDraggable';

enum Selection {
    Hours = 'Hours',
    Minutes = 'Minutes',
};

export const TimePicker = ({ initialHours, initialMinutes }) => {
    const [draggbleHoursRef, dxHours, dyHours, angleHours] = useDraggable({
        initialAngle: initialHours / 12,
    });
    const [draggbleMinutesRef, dxMinutes, dyMinutes, angleMinutes] = useDraggable({
        initialAngle: initialMinutes / 60,
    });
    const [selection, setSelection] = React.useState(Selection.Hours);

    const hours = Math.round(angleHours * 12);
    const normalizedHours = hours === 0 ? 12 : hours;
    const minutes = Math.round(angleMinutes * 60);
    const normalizedMinutes = minutes === 60 ? 0 : minutes;

    const handleClickHours = () => setSelection(Selection.Hours);
    const handleClickMinutes = () => setSelection(Selection.Minutes);

    return (
        <div className="picker">
            <div className="picker__circle">
                <div
                    className="picker__handler picker__handler--hours"
                    ref={draggbleHoursRef}
                    style={{
                        transform: `translate(${dxHours}px, ${dyHours}px)`,
                        opacity: selection === Selection.Hours ? 1 : 0,
                    }}
                />
                <div
                    className="picker__handler picker__handler--minutes"
                    ref={draggbleMinutesRef}
                    style={{
                        transform: `translate(${dxMinutes}px, ${dyMinutes}px)`,
                        opacity: selection === Selection.Minutes ? 1 : 0,
                    }}
                />
                <div className="picker__selected">
                    <button
                        className="picker__output picker__output--hours"
                        type="button"
                        onClick={handleClickHours}
                    >
                        {normalizedHours}
                    </button>
                    <span>:</span>
                    <button
                        className="picker__output picker__output--minutes"
                        type="button"
                        onClick={handleClickMinutes}
                    >
                        {normalizedMinutes}
                    </button>
                </div>
            </div>
        </div>
    );
};
