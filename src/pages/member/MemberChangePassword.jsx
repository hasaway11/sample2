import { useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';

import useInput from "../../hooks/useInput";
import BlockButton from '../../components/common/BlockButton';
import TextField from '../../components/common/TextField';
import useConfirmPassword from '../../hooks/useConfirmPassword';
import {changePassword} from '../../utils/memberApi';
import { AsyncStatus } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';


function MemberChangePassword() {
  // 1. 필요한 기능 가져오기(작성 상태, 비밀번호/새비밀번호/새비밀번호 확인 입력 커스텀훅)
  const [status, setStatus] = useState(AsyncStatus.IDLE);
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const vCurrentPassword = useInput(currentPasswordRef);
  const vNewPassword = useInput(newPasswordRef);
  const vConfirmPassword = useConfirmPassword(confirmPasswordRef, newPasswordRef);
  const navigate = useNavigate();

  // 2. 비밀번호 변경 처리
  const handleChangePassword=async ()=>{
    if(status===AsyncStatus.SUBMITTING) return;
    setStatus(AsyncStatus.SUBMITTING);

    const r1 = vCurrentPassword.check();
    const r2 = vNewPassword.check();
    const r3 = vConfirmPassword.check();
    if (!(r1 && r2 && r3)) {
      setStatus(AsyncStatus.IDLE);
      return;
    }

    try {
      const requestForm = {currentPassword:currentPasswordRef.current.value, newPassword:newPasswordRef.current.value};
      await changePassword(requestForm);
      setStatus(AsyncStatus.SUCCESS);
      alert('비밀번호를 변경했습니다');
      navigate('/');
    } catch(err) {
      // 비밀번호를 변경에 실패한 경우 입력한 값들을 모두 지운다
      currentPasswordRef.current.value="";
      newPasswordRef.current.value="";
      currentPasswordRef.current.value="";
      setStatus(AsyncStatus.FAIL);
    }
  }

  if(status===AsyncStatus.SUBMITTING) return <LoadingSpinner />;

  return (
    <div>
      <h1>비밀번호 변경</h1>
      <div style={{height:400}}>
        <TextField type='password' label='기존 비밀번호' name='current-password' {...vCurrentPassword} ref={currentPasswordRef} />
        <TextField type='password' label='새 비밀번호' name='new-password' {...vNewPassword} ref={newPasswordRef} />
        <TextField type='password' label='비밀번호 확인' name='confirm-password' {...vConfirmPassword} ref={confirmPasswordRef} />
        {status===AsyncStatus.FAIL &&  <Alert variant='danger'>비밀번호를 변경하지 못했습니다</Alert>}
      </div>
      <BlockButton label="변 경" onClick={handleChangePassword} wait={status===AsyncStatus.SUBMITTING}/>
    </div>
  )
}

export default MemberChangePassword