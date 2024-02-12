// ImageUploaderModal.js

import React, { useState } from 'react';
import styles from '../assets/css/imageUploaderModal.module.css'; // Import the CSS module
import axios from 'axios';

const FileInput = ({ onChange }) => (
    <label className={styles.fileInputLabel}>
        <input type="file" onChange={onChange} />
        <span>Choose Image</span>
    </label>
);

const ImageUploaderModal = (props) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file && file.type.substr(0, 5) === 'image') {
            if (file.size > 2 * 1024 * 1024) {
                setError("File is too large. Please select an image less than 2MB");
            } else {
                setSelectedImage(file);
                setError(null);
            }
        } else {
            setSelectedImage(null);
            setError("Please select an image file");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (selectedImage) {
            setLoading(true);

            const formData = new FormData();
            formData.append('image', selectedImage);

            axios.post(`${API_URL}/image/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
                .then((response) => {
                    console.log(response.data);
                    setLoading(false);
                    props.setOpen(false);
                    props.setMyImages([...props.myImages, response.data.image]);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                    setError("Failed to upload image");
                });
        } else {
            setError("Please select an image");
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={() => props.setOpen(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    <form onSubmit={handleSubmit}>
                        <FileInput onChange={handleImageChange} />

                        {selectedImage && <img src={selectedImage} alt="Selected" />}

                        {error && <div className={styles.errorMessage}>{error}</div>}

                        {loading && <div className={styles.loadingSpinner}>Loading...</div>}

                        <button type="submit" className={styles.submitBtn}>
                            Upload Image
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ImageUploaderModal;
