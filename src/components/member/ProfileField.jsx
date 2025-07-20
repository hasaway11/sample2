import React, { forwardRef } from "react";

const ProfileField=forwardRef(({preview, alt, name, label, onChange}, ref)=>{
  return (
     <>
      {preview && <img src={preview} style={{height:'200px', objectFit:'cover'}} alt={alt} />}
      <div className='mb-3 mt-3'>
        <label htmlFor={name} className='form-label'>{label}:</label>
        <input type='file' className='form-control' name={name} onChange={onChange} ref={ref} />
      </div>
    </>
  )
})

export default ProfileField;