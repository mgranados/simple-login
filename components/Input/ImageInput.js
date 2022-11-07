import React, { useState } from 'react';
import { string, func, bool } from 'prop-types';
import axios from 'axios';
import styles from './imageInput.module.css';

export const ImageInput = ({ 
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
    const imageUrl = `https://drive.google.com/uc?id=${fileId}`;
    const defaultImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/1200px-Placeholder_no_text.svg.png';
    const [loading, setLoading] = useState(false);
    const changeHandler = async (e) => {
        const { value, files } = e.target;
        const filedata = files?.[0];

        if (filedata) {
            setLoading(true);
            const formData = new FormData();
            formData.append('temp', filedata);
            await axios.post('/api/uploads', formData, { headers: { "Content-type": "multipart/form-data" } })
                .then(({ data }) => { 
                    const id = data?.id;
                    console.log({ id })
                    onChange(name, value, filedata, id);
                    setLoading(false);
                });
            return;
        }
        
        onChange(name, value, filedata);
    }
    
    const deleteImage = (e) => {
        e.preventDefault();
        axios
            .delete(`/api/uploads?fileId=${fileId}&filename=${name}`)
            .then(() => { 
                console.log('Deleted Image!')
                window.location.reload();
            });
    }
    const labelText = <span>{label}{required && <span className="required">*</span>}</span>;
    
    const inputWithLabel = (
            <>
                {loading && <h3>Loading...</h3>}
                <div><img src={fileId ? imageUrl : defaultImageUrl} alt="profilePic" width="100"/></div>
                {label && <label htmlFor={name}>{labelText}</label>}
                <input
                    className={styles.input}
                    value={file || value}
                    onChange={changeHandler}
                    onBlur={() => onBlur(name)}
                    name={name}
                    type={type}
                    required={required}
                />
                {fileId && 
                    <div><button onClick={deleteImage}>Delete Image</button></div>
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

ImageInput.propTypes = {
    type: string.isRequired, 
    error: string.isRequired,
    name: string.isRequired, 
    label: string.isRequired, 
    value: string.isRequired, 
    file: string,
    required: bool, 
    validated: bool,
    onChange: func, 
    onBlur: func,
    fileId: string.isRequired
};

ImageInput.defaultProps = {
    required: false,
    vlaidated: true,
    onChange: _ => _,
    onBlur: _ => _,
    file: ''
}

export default ImageInput;