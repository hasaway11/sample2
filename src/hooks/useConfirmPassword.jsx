import { useState } from "react";

function useConfirmPassword(ref, passwordRef) {
  const [message, setMessage] = useState('');
  
  const check=()=>{
    setMessage('');
    const value = ref.current?.value || '';

    if(value==='') {
      setMessage('확인을 위해 비밀번호를 다시 입력해주세요');
      return false;
    } else {
      if(passwordRef.current.value!==value) {
        setMessage('새 비밀번호가 일치하지 않습니다');
        return false;
      }
      return true;
    }
  };

  return {message, check};
}

export default useConfirmPassword