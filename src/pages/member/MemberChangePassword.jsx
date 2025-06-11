import { useState } from 'react';
import { Alert } from 'react-bootstrap';

import BlockButton from '../../components/common/BlockButton';
import TextField from '../../components/common/TextField';
import useConfirmPassword from '../../hooks/useConfirmPassword';
import usePassword from '../../hooks/usePassword';
import {changePassword} from '../../utils/memberApi';
import { AsyncStatus } from '../../utils/constants';
import { mutate } from 'swr';
import { useNavigate } from 'react-router-dom';


function MemberChangePassword() {
  console.log("부모 컴포넌트 렌더링...");
  
  // 1. 필요한 기능 가져오기(작성 상태, 비밀번호/새비밀번호/새비밀번호 확인 입력 커스텀훅)
  const [status, setStatus] = useState(AsyncStatus.IDLE);
  const vCurrentPassword = usePassword();
  const vNewPassword = usePassword();
  const vConfirmPassword = useConfirmPassword(vNewPassword);
  const navigate = useNavigate();

  // 2. 파생 속성 : 처리 중
  const isSubmitting = (status===AsyncStatus.SUBMITTING);

  // 3. 비밀번호 변경 처리
  const handleChangePassword=async ()=>{
    if(isSubmitting) return;
    setStatus(AsyncStatus.SUBMITTING);

    const r1 = vCurrentPassword.onBlur();
    const r2 = vNewPassword.onBlur();
    const r3 = vConfirmPassword.onBlur();
    if (!(r1 && r2 && r3)) {
      setStatus(AsyncStatus.IDLE);
      return;
    }

    try {
      const requestForm = {currentPassword:vCurrentPassword.value, newPassword:vNewPassword.value};
      const {data} = await changePassword(requestForm);
      mutate('me', data, false);
      setStatus(AsyncStatus.SUCCESS);
      alert('비밀번호를 변경했습니다');
      navigate('/');
    } catch(err) {
      // 비밀번호를 변경에 실패한 경우 입력한 값들을 모두 지운다
      vCurrentPassword.reset();
      vNewPassword.reset();
      vConfirmPassword.reset();
      setStatus(AsyncStatus.FAIL);
    }
  }

  return (
    <div>
      <h1>비밀번호 변경</h1>
      <div style={{height:400}}>
        <TextField type='password' label='기존 비밀번호' name='current-password' {...vCurrentPassword} />
        <TextField type='password' label='새 비밀번호' name='new-password' {...vNewPassword} />
        <TextField type='password' label='비밀번호 확인' name='confirm-password' {...vConfirmPassword} />
        {status===AsyncStatus.FAIL &&  <Alert variant='danger'>비밀번호를 변경하지 못했습니다</Alert>}
      </div>
      <BlockButton label={isSubmitting ? "비밀번호 변경 중..." : "변 경"} onClick={handleChangePassword} styleName='dark' disabled={isSubmitting}/>
    </div>
  )
}

export default MemberChangePassword