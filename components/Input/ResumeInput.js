import React, { useState } from 'react';
import axios from 'axios';
import styles from './imageInput.module.css';

export const ResumeInput = ({ 
    type, 
    error,
    name, 
    label, 
    value, 
    file,
    required, 
    validated = true,
    onChange, 
    onBlur,
    fileId
}) => {
    console.log({ fileId })
    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
    const defaultResume = 'no file uploaded';
    
    const changeHandler = async (e) => {
        const { value, files } = e.target;
        const filedata = files?.[0];

        if (filedata) {
            const formData = new FormData();
            formData.append('temp', filedata);
            await axios.post('/api/uploads', formData, { headers: { "Content-type": "multipart/form-data" } })
                .then(({ data }) => { 
                    const id = data?.id;
                    console.log({ id })
                    onChange(name, value, filedata, id);
                });
            return;
        }
        
        onChange(name, value, filedata);
    }
    
    const deleteFile = (e) => {
        e.preventDefault();
        axios
            .delete(`/api/uploads?fileId=${fileId}&filename=${name}`)
            .then(({ data }) => { 
                console.log('Deleted File!')
                window.location.reload();
            });
    }
    const labelText = <span>{label}{required && <span className="required">*</span>}</span>;
    
    const inputWithLabel = (
            <>
                {label && <label htmlFor={name}>{labelText}</label>}
                <div>Current Resume: {fileId ? <a href={fileUrl} target="_blank">resume</a> : defaultResume}</div>
                <input
                    className={styles.input}
                    value={value}
                    onChange={changeHandler}
                    onBlur={() => onBlur(name)}
                    name={name}
                    type={type}
                    file={file}
                    required={required}
                />
                {fileId && 
                    <div><button onClick={deleteFile}>Delete File</button></div>
                }
            </>
        )
    return (
        <div>
            {inputWithLabel}
            <div>{!validated ? error : ' '}</div>
        </div>
    );
};

export default ResumeInput;