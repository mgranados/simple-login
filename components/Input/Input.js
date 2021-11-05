import React from 'react';

export const Input = ({ 
    type, 
    error,
    validated,
    name, 
    label, 
    value, 
    required, 
    onChange, 
    onBlur 
}) => {
    const labelText = <span>{label}{required && <span className="required">*</span>}</span>
    return (
        <div>
            {label && <label htmlFor={name}>{labelText}</label>}
            <input
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                onBlur={() => onBlur(name)}
                name={name}
                type={type}
                required={required}
            />
            <div>{!validated ? error : ' '}</div>
        </div>
    );
};

export default Input;