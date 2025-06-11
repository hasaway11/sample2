import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import useUsername from '../../hooks/useUsername';
import usePassword from '../../hooks/usePassword';
import TextField from '../../components/common/TextField';
import BlockButton from '../../components/common/BlockButton';
import {login} from '../../utils/authApi'
import useAuthStore from '../../stores/useAuthStore';
import { AsyncStatus } from '../../utils/constants';
import { Alert } from 'react-bootstrap';

function MemberLogin() {
   console.log("부모 컴포넌트 렌더링...");
  
  // 1. 필요한 기능 가져오기(작성 상태, 로그인 결과, 이메일과 비밀번호 입력 커스텀 훅, 라우팅)
  const [status, setStatus] = useState(AsyncStatus.IDLE);
  const [result, setResult] = useState(0);
  const vUsername = useUsername();
  const vPassword = usePassword();
  const navigate = useNavigate();

  // 2. 로그인에 성공했을 때 zustand store에 로그인 아이디를 저장하기 위한 setter
  const setUsername = useAuthStore(state=>state.setUsername);

  // 3. 로그인 처리
  const doLogin=async ()=>{
    if(status===AsyncStatus.SUBMITTING) return;
    setStatus(AsyncStatus.SUBMITTING);

    const r1 = await vUsername.onBlur();
    const r2 = vPassword.onBlur();
    if(!(r1 && r2)) {
      setStatus(AsyncStatus.IDLE);
      return;
    }

    const requestForm = {username:vUsername.value, password:vPassword.value};
    try {
      // 로그인에 성공하면 store에 아이디를 업데이트한 다음 /경로로 이동
      const response = await login(requestForm)
      setUsername(response.data.username);
      setStatus(AsyncStatus.IDLE);
      navigate("/");
      return;
    } catch(err) {
      setStatus(AsyncStatus.FAIL);
      // 로그인 실패시 응답 상태를 갱신 : 401이면 로그인 실패, 403이면 계정 비활성화
      setResult(err.status);
      console.log(err);
    } 
  };

  return (
    <div>
      <h1>로그인</h1>
      <div style={{height:300}}>
        <TextField label='아이디' name="username" {...vUsername} />
        <TextField type='password' label='비밀번호' name="password" {...vPassword}/>
        {(status===AsyncStatus.FAIL && result===401) && <Alert variant='danger'>로그인 실패 : 이메일 또는 비밀번호를 다시 확인하세요.</Alert>}
        {(status===AsyncStatus.FAIL && result===403) && <Alert variant='danger'>로그인 실패 : 확인되지 않은 계정입니다. 이메일을 확인하세요.</Alert>}
      </div>
      <BlockButton label={status===AsyncStatus.SUBMITTING ? "로그인 중..." : "로그인"} onClick={doLogin} styleName='primary' disabled={status===AsyncStatus.SUBMITTING} />
    </div>
  )
}

export default MemberLogin