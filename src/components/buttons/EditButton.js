// src/components/buttons/EditButton.js
import React, { useState } from 'react';
import styles from './EditButton.module.css';

const EditButton = () => {
    const [showEdit, setShowEdit] = useState(false);

    const handleEditToggle = () => {
        setShowEdit(prevState => !prevState);
      }

    return (
        <button className={styles.editButton} onClick={handleEditToggle}>{showEdit ? "Hide Form" : "Edit Post"}</button>
    )
}

export default EditButton;