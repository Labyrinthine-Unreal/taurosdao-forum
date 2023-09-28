// components/layout/AuthorInput.js

import React, { useState } from 'react';

const AuthorInput = ({ defaultValue, onUpdate }) => {
  const [authorName, setAuthorName] = useState(defaultValue || '');

  const handleInputChange = (e) => {
    const newName = e.target.value;
    setAuthorName(newName);
    onUpdate(newName);
  };

  return (
    <textarea
      rows="2"
      value={authorName}
      onChange={handleInputChange}
      placeholder="Your Name"
    />
  );
};

export default AuthorInput;
