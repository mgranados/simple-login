import React, { useState, useEffect } from 'react';
import { string, array, func} from 'prop-types';
import axios from 'axios';
import { Input, CheckboxGroup } from '~components';

export const Form = ({ inputs, title, route, handleData, method = 'post' }) => {
    if (!Array.isArray(inputs) || !inputs.length) return null;

    const initFields = () => {
        const fields = {};
        inputs.forEach((input) => {
            const { type, name, checkboxes = [] } = input;
            if (type === "checkboxes") {
                checkboxes.forEach((checkbox) => {
                    fields[checkbox.name] = { ...checkbox, validated: true };
                });
                return;
            }
            fields[name] = { ...input, validated: true };
        });
        return fields;
    };

    const [fields, setFields] = useState(initFields());
    const [formError] = useState('');

    useEffect(() => {
        window.pteTempFileIds = [];
        return async () => {
            const deletedTempFiles = window.pteTempFileIds?.map((fileId) => {
                return new Promise((resolve) => {
                    axios
                    .delete(`/api/uploads?fileId=${fileId}`)
                    .then(() => { 
                        console.log(`deleted ${fileId}`)
                        resolve({})
                    });
                });
            }) || [];
            Promise.all(deletedTempFiles).then(() => {
                window.pteTempFileIds = undefined;
            })
        }
    }, []);

    const addTempFile = (fileId) => {
        window.pteTempFileIds = [...window.pteTempFileIds, fileId];
    }
    
    // const removeTempfile = (fileId) => {
    //     const fileIndex = window.pteTempFileIds.indexOf(fileId);
    //     if (fileIndex === -1) return;
    //     const newTempFiles = [...window.pteTempFileIds];
    //     newTempFiles.splice(fileIndex, 1);
    //     window.pteTempFileIds = newTempfiles;
    // }

    const fieldKeys = Object.keys(fields);

    const setField = (fieldName, value, file, fileId) => {
        const newFields = {...fields};
        const { type, checked } = newFields[fieldName];
        if (type === 'checkbox') {
            newFields[fieldName].checked = !checked;
            setFields(newFields);
            return;
        }
        if (type === 'file') {
            if (fileId) {
                newFields[fieldName].fileId = fileId; 
               addTempFile(fileId);
            }

            newFields[fieldName].value = '';
            newFields[fieldName].file = file;
            setFields(newFields);
            return;
        }
        newFields[fieldName].value = value;
        setFields(newFields);
    };

    const validateField = (fieldName) => {
        const newFields = {...fields};
        const { [fieldName]: { value, validation = {} } } = newFields;
        newFields[fieldName].validated = Object.keys(validation).reduce((acc, validationType) => {
            if (!acc) return acc;
            switch (validationType) {
                case "min":
                    return value && value.length >= validation[validationType];
                case "max":
                    return value && value.length <= validation[validationType];
                case "match":
                    return value && value === newFields[validation.match].value;
                case "pattern":
                    var pattern = new RegExp(validation[validationType], 'i');
                    return pattern.test(value || '');
                case "type":
                    // TODO: update file type validation 
                    return true;
                default:
                    return acc; 
            }
        }, true);
        setFields(newFields);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('pic1: ', fields['profilePic1']);
        fieldKeys.forEach((name) => validateField(name));
        const isValid = fieldKeys.reduce((acc, name) => {
            if(!acc) return acc;
            return fields[name].validated;
        }, true);
        
        if (!isValid) return;

        const formData = new FormData();
        inputs.forEach(({ name, type, checkboxes }) => {
            if (type === 'checkboxes') {
                const choices = checkboxes.reduce((acc, { name: checkboxName }) => {
                    validateField(checkboxName);
                    const { checked, value: checkboxValue } = fields[checkboxName];

                    if (!checked) return acc;
                    
                    return `${acc}${acc.length > 0 ? ', ' + checkboxValue : checkboxValue}`;
                }, '');
                
                formData.append(name, choices);
                
                return;
            }

            const { file, value } = fields[name];

            if (type === 'file') {
                formData.append(name, file);
                return;
            }
            formData.append(name, value);
        });
        
        axios[method](route, formData, { 
            headers: { "Content-type": "multipart/form-data" }
        }).then(handleData);
    }

    const renderInputs = () => 
        inputs.map((input, index) => {
            const { name, checkboxes, inquiry, type } = input;
            const { fileId } = fields[name] || {};
            
            if (type === 'checkboxes') {
                const checkedBoxes = checkboxes.map((checkbox) => {
                    const { validated, checked } = fields[checkbox.name];
                    return { ...checkbox, validated, checked };
                });

                return (
                    <CheckboxGroup 
                        key={index} 
                        inquiry={inquiry} 
                        checkboxes={checkedBoxes}
                        onChange={setField} 
                        onBlur={validateField} 
                    />
                );
            }
            
            const { value, validated } = fields[name];
            return(
                <Input 
                    {...input}
                    key={index} 
                    value={value}
                    validated={validated}
                    onChange={setField}
                    onBlur={validateField}
                    fileId={fileId}
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

Form.propTypes = {
    inputs: array.isRquired, 
    title: string.isRquired, 
    route: string.isRquired, 
    handleData: func.isRquired, 
    method: string.isRquired
}

export default Form;