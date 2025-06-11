import React from "react";

const BlockButton = ({label, onClick, styleName})=> {
  console.log("BlockButton");
  const className = `btn btn-outline-${styleName} btn-block`;
  return (
    <div className='d-grid gap-3 mt-3 mb-3'>
      <button type='button' className={className} onClick={onClick}>{label}</button>
    </div>
  )
};

export default React.memo(BlockButton);