import  { useState } from 'react'

function usePhoto(ref) {
  const [value, setValue] = useState(null);
  const [preview, setPreview] = useState(null);

  const onChange = (e) => {
    console.log(ref);
    const file = e.target.files[0];
    setValue(file);
    setPreview(URL.createObjectURL(file));
  };

  const reset=()=>{
    console.log(ref);
    setValue(null);
    ref.current.value="";
  };

  return { value, preview, onChange, reset, setPreview};
}


export default usePhoto