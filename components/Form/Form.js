import React, { useState, useEffect } from 'react';
import Input from '../Input/Input';
import Router from 'next/router';
import cookie from 'js-cookie';

export const Form = ({ inputs, title, route }) => {
    if (!inputs || !Array.isArray(inputs) || !inputs.length) return null;

    const initFields = () => {
        const fields = {};
        inputs.forEach(({ name, error }) => fields[name] = { value: '', validated: true, error });
        return fields;
    };

    const [fields, setFields] = useState(initFields());
    const [formError, setFormError] = useState('');

    const setField = (fieldName, value) => {
        const newFields = {...fields};
        newFields[fieldName].value = value;
        setFields(newFields);
    };

    const validateField = (fieldName) => {
        const field = inputs.find(({ name }) => name === fieldName);
        const { validation = {} } = field;
        const newFields = {...fields};
        const { [fieldName]: { value } } = newFields;
        newFields[fieldName].validated = Object.keys(validation).reduce((acc, type) => {
            if (!acc) return acc;
            switch (type) {
                case "min":
                    return value.length >= validation[type];
                case "max":
                    return value.length <= validation[type];
                case "match":
                    return value === newFields[validation.match].value;
                case "pattern":
                    const pattern = new RegExp(validation[type], 'i');
                    return pattern.test(value);
                default:
                    return acc; 
            }
        }, true);
        setFields(newFields);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const postFields = {};
        inputs.forEach(({ name }) => {
            validateField(name);
            postFields[name] = fields[name].value;
        });

        const isValid = inputs.reduce((acc, { name }) => {
            if(!acc) return acc;
            return fields[name].validated;
        }, true);

        if (!isValid) return;
    
        fetch(`/api/${route}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(postFields),
        })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.error) {
            setFormError(data.message);
          }
          if (data && data.token) {
            //set cookie
            cookie.set('token', data.token, {expires: 2});
            Router.push('/');
          }
        });
    }

    const renderInputs = () => 
        inputs.map((input, index) => {
            const { value, validated } = fields[input.name];
            return(
                <Input 
                    {...input}
                    key={index} 
                    value={value}
                    validated={validated}
                    onChange={setField}
                    onBlur={validateField}
                />
            )
        });
        
    return (
        <form>
            <fieldset>
                {title && <legend>{title}</legend>}
                {renderInputs()}
            </fieldset>
            <button onClick={onSubmit}>Submit</button>
            {formError && <p style={{color: 'red'}}>{formError}</p>}
        </form>
    );
};

export default Form;