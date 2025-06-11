import  { useCallback, useState } from 'react'

const pattern =  /^[0-9a-zA-Z]{6,10}$/;

function usePassword() {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  const onChange = useCallback(e=>setValue(e.target.value), []);
  
  const onBlur = useCallback(() => {
    setMessage('');
    if (pattern.test(value)) 
      return true;
    setMessage('비밀번호는 영숫자 6~10자입니다');
    return false;
  }, [value]);

  const reset = useCallback(()=>setValue(''),[]);

  return {value, message, onBlur, onChange, reset};
}

export default usePassword