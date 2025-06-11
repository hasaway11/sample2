import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import usePassword from '../../hooks/usePassword';
import {checkPassword} from '../../utils/memberApi';
import { AsyncStatus } from '../../utils/constants';
import usePasswordStore from '../../stores/usePasswordStore';
import TextField from '../../components/common/TextField';
import BlockButton from '../../components/common/BlockButton';


function MemberCheckPassword() {
  console.log("부모 컴포넌트 렌더링...");
  
  // 1. 필요한 기능 가져오기(작성 상태, 비밀번호 확인 여부, 비밀번호 확인 여부 setter, 비밀번호 비밀번호 입력 커스텀 훅, 라우팅)
  const [status, setStatus] = useState(AsyncStatus.IDLE);
  const isPasswordVerified = usePasswordStore(state=>state.isPasswordVerified);
  const setPasswordVerified = usePasswordStore(state=>state.setPasswordVerified);
  const vPassword = usePassword();
  const navigate = useNavigate();

  // 2. 파생 속성 : 프로필 변경 처리 중
  const isSubmitting = status === AsyncStatus.SUBMITTING;

  // 3. 비밀번호 확인 처리
  const handleCheckPassword=async ()=>{
    if(isSubmitting) return;
    setStatus(AsyncStatus.SUBMITTING);

    if (!(vPassword.onBlur())) {
      setStatus(AsyncStatus.IDLE);
      return;
    }
    
    try {
      await checkPassword(vPassword.value);
      setPasswordVerified();
      setStatus(AsyncStatus.SUCCESS);
      navigate("/member/read");
      return;
    } catch(err) {
      setStatus(AsyncStatus.FAIL);
      console.log(err);
    } 
  }

  // 4. 렌더링 조건 : 비밀번호가 확인된 경우 내정보 보기로 이동
  if (isPasswordVerified) return <Navigate to="/member/read" replace />;

  return (
    <div>
      {status===AsyncStatus.FAIL &&  <Alert variant='danger'>비밀번호를 확인하지 못했습니다</Alert>}
      <TextField type='password' label='비밀번호' name='password' {...vPassword} />
      <BlockButton label={isSubmitting? "비밀번호 확인 중...":"확 인"} onClick={handleCheckPassword} styleName='dark' disabled={isSubmitting}/>
    </div>
  )
}

export default MemberCheckPassword