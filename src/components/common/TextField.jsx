import { forwardRef } from "react";

const TextField=forwardRef(({name, type='text', label, check, message}, ref)=>{
  return  (
    <div className='mt-3 mb-3'>
      <label htmlFor={name} className='form-label'>{label}:</label>
      <input type={type} className='form-control' onBlur={check}  ref={ref}/>
      {message!=='' && <span style={{color:'red'}}>{message}</span>}
    </div>
  )
});

export default TextField;