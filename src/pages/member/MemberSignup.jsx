import { useRef, useState } from "react";
import { Alert } from "react-bootstrap";

import useInput from "../../hooks/useInput";
import BlockButton from "../../components/common/BlockButton";
import TextField from "../../components/common/TextField";
import ProfileField from "../../components/member/ProfileField";
import useConfirmPassword from "../../hooks/useConfirmPassword";
import usePhoto from "../../hooks/usePhoto";
import {idAvailable, signup} from '../../utils/memberApi';
import { AsyncStatus, Patterns } from "../../utils/constants";

function MemberSignup() {
  // 1. 필요한 기능 가져오기(작성 상태, 프로필/아이디/비밀번호/비밀번호 확인/이메일 커스텀 훅)
  const [status, setStatus] = useState(AsyncStatus.IDLE);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const emailRef = useRef();

  const vProfile = usePhoto();
  const vUsername = useInput(usernameRef, false, Patterns.USERNAME , {method:idAvailable, message:"사용중인 아이디입니다" });
  const vPassword = useInput(passwordRef, false, Patterns.PASSWORD);
  const vEmail = useInput(emailRef, false, Patterns.EMAIL);
  const vConfirmPassword = useConfirmPassword(confirmPasswordRef,  passwordRef);

  // 2. 가입 처리(상태 확인 및 변경, 검증, formData 생성 및 회원 가입)
  // - useCallback을 사용하지 않은 이유
  //   useCallback을 사용하면 BlockButton의 재렌더링을 막을 수는 있지만 vUsername, vPassowrd등의 최신 입력값을 사용할 수 없다
  //   [] 배열에 vUsername 등 커스텀 훅 객체를 추가하는 경우
  //      최신 입력값이 적용되지만 값을 입력할 때마다 handleMemberSingup이 새로 생성되어 BlockButton 재렌더링이 다시 발생한다
  const handleMemberSignup=async()=>{
    if(status===AsyncStatus.SUBMITTING) return;
    setStatus(AsyncStatus.SUBMITTING);

    const r1 = await vUsername.check();
    const r2 = vPassword.check();
    const r3 = vConfirmPassword.check();
    const r4 = vEmail.check();
    if (!(r1 && r2 && r3 && r4)) {
      setStatus(AsyncStatus.IDLE);
      return;
    }

    const formData = new FormData();
    formData.append('username', usernameRef.current.value);
    formData.append('password', passwordRef.current.value);
    formData.append('email', emailRef.current.value);
    formData.append('profile', vProfile.value);

    try {
      await signup(formData);
      setStatus(AsyncStatus.SUCCESS);
    } catch(err) {
      setStatus(AsyncStatus.FAIL);
      console.log(err);
    }
  };

  // 3. 가입 성공하면 메시지 출력 or 가입 화면
  if(status===AsyncStatus.SUCCESS) {
    return <Alert variant="success">가입확인메일을 발송했습니다. 이메일을 확인하세요</Alert>
  }
  return (
    <>
      {status===AsyncStatus.FAIL &&  <Alert variant='danger'>회원 가입에 실패했습니다</Alert>}
      <ProfileField name='photo' label='사진' alt='미리보기' {...vProfile} />
      <TextField label='아이디' name='username' {...vUsername} ref={usernameRef} />
      <TextField label='이메일' name='email' {...vEmail} ref={emailRef} />
      <TextField type='password' label='비밀번호' name='password' {...vPassword} ref={passwordRef} />
      <TextField type='password' label='비밀번호 확인' name='confirm-password' {...vConfirmPassword} ref={confirmPasswordRef} />
      <BlockButton label="회원 가입" onClick={handleMemberSignup} wait={status===AsyncStatus.SUBMITTING} />
    </>
  )
}

export default MemberSignup