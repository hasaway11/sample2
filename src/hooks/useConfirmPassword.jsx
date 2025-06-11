import  { useCallback, useState } from 'react'

function useConfirmPassword(vPassword) {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  
  const onChange = useCallback(e=>setValue(e.target.value),[]);

  const onBlur=useCallback(()=>{
    setMessage('');
    if(value==='') {
      setMessage('확인을 위해 비밀번호를 다시 입력해주세요');
      return false;
    } else {
      if(vPassword.value===value)
        return true;
      setMessage('새 비밀번호가 일치하지 않습니다');
      return false;
    }
  },[value]);

  const reset = useCallback(()=>setValue(''),[]);

  return {value, message, onBlur, onChange, reset};
}

export default useConfirmPassword