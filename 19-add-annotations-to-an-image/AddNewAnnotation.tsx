import * as React from 'react';

export const AddNewAnnotation = ({ onAddAnnotation, onCancel }) => {
    const [value, setValue] = React.useState('');
    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'Enter':
                value && onAddAnnotation(value);
                break;
            case 'Escape':
                onCancel();
                break;
            default:
                break;
        }
    };

    return (
        <div className="annotator__new">
            <textarea
                autoFocus={true}
                placeholder="Press Enter to save annotation ..."
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};
