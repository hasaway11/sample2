import { useState } from "react";
import { mutate } from "swr";

function useComment(ref) {
  const [message, setMessage] = useState('');

  const check=()=>{
    setMessage('');
    const value = ref.current?.value || '';
    if(value!=='')
      return true;
    setMessage('필수입력입니다');
    return false;
  };

  const update = (pno, newComments)=>{
    mutate(['pno', pno], (prevData) => {
      if (!prevData) 
        return prevData;
      return {...prevData, comments: newComments };
    }, false);
  };

  return {message, check, update };
}

export default useComment