import React from 'react';
import { Input } from '~components';

const CheckboxGroup = ({ inquiry, checkboxes, onChange, onBlur }) => {
    const inputs = checkboxes.map((checkbox, index) => {
        return (
            <Input key={index} {...checkbox} onChange={onChange} onBlur={onBlur} />
        );
    });
    return (
        <div>
            <div>{inquiry}</div>
            <div>{inputs}</div>
        </div>
    );
};

export default CheckboxGroup;
