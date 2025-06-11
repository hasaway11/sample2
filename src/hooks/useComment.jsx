import { useCallback, useState } from "react";
import {add, erase} from '../utils/commentApi'
import { mutate } from "swr";

function useComment() {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  const onChange = useCallback(e=>setValue(e.target.value), []);

  const onBlur=useCallback(()=>{
    setMessage('');
    if(value!=='')
      return true;
    setMessage('필수입력입니다');
    return false;
  },[value]);

  const update = (pno, newComments)=>{
    mutate(['pno', pno], (prevData) => {
      if (!prevData) 
        return prevData;
      return {...prevData, comments: newComments };
    }, false);
  };

  const onWrite = useCallback(async(pno)=>{
    const result = onBlur();
    if(!result) 
      return;
    const requestForm =  {pno: pno, content:value};
    try {
      const response = await add(requestForm);
      update(pno, response.data);
      setValue('');
    } catch(err) {
      console.log(err);
    }
  }, [value]);

  const onRemove=useCallback(async(cno, pno)=>{
    try {
      const response = await erase(cno, pno);
      update(pno, response.data);
    } catch(err) {
      console.log(err);
    }
  },[]); 

  return {value, setValue, message, onBlur, onChange, onRemove, onWrite};
}

export default useComment