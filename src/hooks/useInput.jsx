import { useState } from "react";

function useInput(ref, required=true, pattern=null, api=null) {
  const [message, setMessage] = useState('');

  const check = async ()=>{
    const value = ref.current?.value || '';
    setMessage('');
    if(required && value==='') {
      setMessage("필수입력입니다");
      return false;
    }
    if(pattern && !pattern.regexp.test(value)) {
      setMessage(pattern.message);
      return false;
    }
    if(api!=null) {
      try {
        await api.method(value);
        return true;
      } catch (err) {
        setMessage(api.message);
        return false;
      }
    }
    return true
  };

  return {message, check};
}

export default useInput