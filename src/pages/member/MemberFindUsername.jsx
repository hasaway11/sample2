import { useRef, useState } from "react";
import { Alert } from "react-bootstrap";

import useInput from "../../hooks/useInput";
import TextField from "../../components/common/TextField";
import BlockButton from "../../components/common/BlockButton";
import {findUsername} from '../../utils/memberApi';
import { AsyncStatus } from "../../utils/constants";

function MemberFindUsername() {
  // 1. 필요한 기능 가져오기(작성 상태, 이메일 입력 커스텀 훅, 아이디 검색 결과 상태)
  const [status, setStatus] = useState(AsyncStatus.IDLE);
  const [username, setUsername] = useState('');
  const emailRef = useRef();
  const vEmail = useInput(emailRef);

  const handleFindUsername=async ()=>{ 
    if(status===AsyncStatus.SUBMITTING) return;
    setStatus(AsyncStatus.SUBMITTING);

    if (!vEmail.check()) {
      setStatus(AsyncStatus.IDLE);
      return;
    }

    try {
      const response = await findUsername(emailRef.current.value);
      setUsername(response.data);
      setStatus(AsyncStatus.SUCCESS);
    } catch(err) {
      setStatus(AsyncStatus.FAIL);
      console.log(err);
    }
  }

  return (
    <div>
      <h1>아이디 찾기</h1>
      <div style={{height:200}}>
        <TextField label='이메일' name='email' {...vEmail} ref={emailRef} />
        {status===AsyncStatus.SUCCESS &&  <Alert variant='success'>당신의 아이디 : {username}</Alert>}
        {status===AsyncStatus.FAIL && <Alert variant='danger'>아이디를 찾지 못했습니다</Alert>}
      </div>
      <BlockButton label="아이디 찾기" onClick={handleFindUsername} wait={status===AsyncStatus.SUBMITTING} />
    </div>
  )
}

export default MemberFindUsername