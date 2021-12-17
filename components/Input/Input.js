import React from 'react';
import ImageInput from './ImageInput';
import ResumeInput from './ResumeInput';

export const Input = (props) => {
    const { 
        type, 
        error,
        name, 
        label, 
        value, 
        required, 
        checked,
        validation = {},
        validated = true,
        onChange, 
        onBlur,
        file,
        fileId
    } = props;
    const { type: validationType } = validation;
    if (validationType === 'image') {
        return (
            <ImageInput {...{
                ...props,
                fileId
            }}/>
        );
    }

    if (validationType === 'resume') {
        return (
            <ResumeInput {...{
                ...props,
                fileId
            }} />
        );
    }
    const changeHandler = (e) => {
        const { value, files } = e.target;
        const filedata = files?.[0];
        onChange(name, value, filedata);
    }
    const labelText = <span>{label}{required && <span className="required">*</span>}</span>;
    const inputWithLabel = type === "checkbox" 
        ? (
            <>
                <input
                    value={value}
                    onChange={changeHandler}
                    onBlur={() => onBlur(name)}
                    name={name}
                    checked={checked}
                    type={type}
                    file={file}
                    required={required} 
                />
                <span>{labelText}</span>
            </>
          )
        : (
            <>
                {label && <label htmlFor={name}>{labelText}</label>}
                <input
                    value={value}
                    onChange={changeHandler}
                    onBlur={() => onBlur(name)}
                    name={name}
                    type={type}
                    required={required}
                />
            </>
        )
    return (
        <div>
            {inputWithLabel}
            <div>{!validated ? error : ' '}</div>
        </div>
    );
};

export default Input;