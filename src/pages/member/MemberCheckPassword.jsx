import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import useInput from "../../hooks/useInput";
import {checkPassword} from '../../utils/memberApi';
import { AsyncStatus } from '../../utils/constants';
import usePasswordStore from '../../stores/usePasswordStore';
import TextField from '../../components/common/TextField';
import BlockButton from '../../components/common/BlockButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';


function MemberCheckPassword() {
  // 1. 필요한 기능 가져오기(작성 상태, 비밀번호 확인 여부, 비밀번호 확인 여부 setter, 비밀번호 비밀번호 입력 커스텀 훅, 라우팅)
  const [status, setStatus] = useState(AsyncStatus.IDLE);
  const {isPasswordVerified, setPasswordVerified} = usePasswordStore();
  const passwordRef = useRef();
  const vPassword = useInput(passwordRef);
  const navigate = useNavigate();

  // 2. 비밀번호 확인 처리
  const handleCheckPassword=async ()=>{
    if(status===AsyncStatus.SUBMITTING) return;
    setStatus(AsyncStatus.SUBMITTING);

    if (!(vPassword.check())) {
      setStatus(AsyncStatus.IDLE);
      return;
    }
    
    try {
      await checkPassword(passwordRef.current.value);
      setPasswordVerified();
      navigate("/member/read");
      return;
    } catch(err) {
      setStatus(AsyncStatus.FAIL);
      console.log(err);
    } 
  }

  if(isPasswordVerified===true) return <Navigate to="/member/read" replace />;
  if(status===AsyncStatus.SUBMITTING) return <LoadingSpinner />;

  return (
    <div>
      {status===AsyncStatus.FAIL &&  <Alert variant='danger'>비밀번호를 확인하지 못했습니다</Alert>}
      <TextField type='password' label='비밀번호' name='password' {...vPassword} ref={passwordRef} />
      <BlockButton label="확 인" onClick={handleCheckPassword} wait={status===AsyncStatus.SUBMITTING} />
    </div>
  )
}

export default MemberCheckPassword