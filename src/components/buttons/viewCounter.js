import React from "react";
const ViewCounter = () => {

    let count = 0; 

  return (
      <button onClick={()=>count++}>
        {count}
      </button>
  );
};

export default ViewCounter;


