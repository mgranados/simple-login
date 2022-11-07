import React from 'react';
import { string, array, func} from 'prop-types';
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

CheckboxGroup.propTypes = {
    inquiry: string.isRequired,
    checkboxes: array.isRequired,
    onChange: func.isRequired,
    onBlur: func
}

CheckboxGroup.defaultProps = {
    onBlur: _ => _
}

export default CheckboxGroup;
