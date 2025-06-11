import { useState } from "react";
import { Alert } from "react-bootstrap";

import TextField from "../../components/common/TextField";
import BlockButton from "../../components/common/BlockButton";
import { AsyncStatus } from "../../utils/constants";
import useUsername from "../../hooks/useUsername";
import { resetPassword } from "../../utils/memberApi";

function MemberResetPassword() {
  console.log("부모 컴포넌트 렌더링...");

  const [status, setStatus] = useState(AsyncStatus.IDLE);
  const vUsername = useUsername();

  const handleResetUsername=async ()=>{
    if(status===AsyncStatus.SUBMITTING) return;
    setStatus(AsyncStatus.SUBMITTING);

    if (!vUsername.onBlur()) {
      setStatus(AsyncStatus.IDLE);
      return;
    }

    try {
      await resetPassword(vUsername.value);
      setStatus(AsyncStatus.SUCCESS);
    } catch(err) {
      setStatus(AsyncStatus.FAIL);
    }
  }

  return (
    <div>
      <h1>비밀번호 찾기</h1>
      <p>&#x2714; 비밀번호의 경우 암호화 저장되어 분실 시 찾아드릴 수 없는 정보 입니다.</p>
      <p>&#x2714; 본인 확인을 통해 비밀번호를 재설정 하실 수 있습니다.</p>
      {status===AsyncStatus.SUCCESS &&  <Alert variant='success'>임시비밀번호를 가입 이메일로 보냈습니다</Alert>}
      {status===AsyncStatus.FAIL && <Alert variant='danger'>사용자 정보를 확인하지 못했습니다</Alert>}
      <TextField label='아이디' name='username' {...vUsername} />
      <BlockButton label={status===AsyncStatus.SUBMITTING ? "찾는 중...":"비밀번호 찾기"} onClick={handleResetUsername} styleName='danger' disabled={status===AsyncStatus.SUBMITTING} />
    </div>
  )
}

export default MemberResetPassword