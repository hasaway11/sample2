import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import useSWR, { mutate } from "swr";

import ProfileField from "../../components/member/ProfileField";
import usePhoto from "../../hooks/usePhoto";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import usePasswordStore from '../../stores/usePasswordStore';
import { AsyncStatus } from "../../utils/constants";
import { changeProfile, read } from '../../utils/memberApi';

function MemberRead() {
  console.log("부모 컴포넌트 렌더링...");

  // 1. 필요한 기능 가져오기
  const navigate = useNavigate();
  // 비밀번호가 확인되었는 지 여부
  const isPasswordVerified = usePasswordStore(state=>state.isPasswordVerified);
  // 프로필 변경이 가능 : 프로필 커스텀 훅과 변경 작업 상태
  const [status, setStatus] = useState(AsyncStatus.IDLE);
  const vProfile = usePhoto();
  
  const {data, error, isLoading } = useSWR(['me'], ()=>read());

  // 2. 데이터가 fetch되고 나면 프로필 커스텀 훅 초기화
  useEffect(()=>{
    if(data) 
      vProfile.setPhotoUrl(data.profile);
  }, [data]);


  // 3. 파생 속성 : 프로필 변경 처리 중
  const isSubmitting = status === AsyncStatus.SUBMITTING;

  // 4. 프로필 변경
  const handleChangeProfile=async()=>{
    if(status===AsyncStatus.SUBMITTING) return;
    setStatus(AsyncStatus.SUBMITTING);

    if(!vProfile.value)
      return;
    try {
      const formData = new FormData();
      formData.append('profile', vProfile.value);
      const {data} = await changeProfile(formData);
      // 부모의 swr 캐시를 갱신
      mutate('me', data, false);
      setStatus(AsyncStatus.SUCCESS);
    } catch(err) {
      setStatus(AsyncStatus.FAIL);
      console.log(err);
    } 
  }
  
  // 5. 조건 렌더링 : 비밀번호가 확인되지 않은 경우 비밀번호 확인으로 이동하는 조건 포함
  if (isPasswordVerified) return <Navigate to="/member/check-password" replace />;
  if(isLoading)  return <LoadingSpinner />;
  if(error) return <Alert variant='danger'>서버가 응답하지 않습니다</Alert>;

  return (
    <div>
      <table className='table table-border'>
        <tbody>
          <tr>
            <td colSpan={2}>
              <ProfileField name='photo' label='사진' alt='미리보기' {...vProfile} />
              <button className='btn btn-primary' onClick={handleChangeProfile} disabled={vProfile.value===null}>{isSubmitting? "프사 변경 중...":"프사 변경"}</button>
            </td>
          </tr>
          <tr>
            <td>아이디</td>
            <td>{data.username}</td>
          </tr>
          <tr>
            <td>이메일</td>
            <td>{data.email}</td>
          </tr>
          <tr>
            <td>레벨</td>
            <td>{data.level}</td>
          </tr>
          <tr>
            <td>가입입</td>
            <td>{`${data.joinday} (${data.days}일)`}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              <button className='btn btn-success' onClick={()=>navigate('/member/change-password')}>비밀번호 변경으로</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default MemberRead