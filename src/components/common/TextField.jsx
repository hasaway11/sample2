import React from "react";

const TextField=({name, type='text', label, value, onChange, onBlur, message})=>{
  console.log("TextField : ", name);
  return  (
    <div className='mt-3 mb-3'>
      <label htmlFor={name} className='form-label'>{label}:</label>
      <input type={type} className='form-control' onChange={onChange} onBlur={onBlur} value={value}/>
      {message!=='' && <span style={{color:'red'}}>{message}</span>}
    </div>
  )
};

export default React.memo(TextField);