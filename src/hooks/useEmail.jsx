import  { useCallback, useState } from 'react'

const pattern =  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

function useEmail() {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  const onChange = useCallback(e=>setValue(e.target.value),[]);

  const onBlur = useCallback(()=>{
    setMessage('');
    if(pattern.test(value))
      return true;
    setMessage('이메일을 올바르게 입력해주세요');
    return false;
  },[value]);

  const reset = useCallback(()=>setValue(""),[]);

  return {value, message, onBlur, onChange, reset};
}

export default useEmail