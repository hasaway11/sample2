import 'react-quill-new/dist/quill.snow.css';
import './PostWrite.css';

import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import useSWR from 'swr';
import { Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import TextField from "../../components/common/TextField";
import BlockButton from "../../components/common/BlockButton";
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { AsyncStatus, modules } from '../../utils/constants';
import { convertToInt } from '../../utils/constants';
import { read, update } from '../../utils/postApi';
import useInput from '../../hooks/useInput';
import useAuthStore from '../../stores/useAuthStore';

function PostUpdate() {
  // 1. 필요한 기능 가져오기(작성 상태, 제목 커스텀 훅, 내용 상태, 라우팅, 로그인 이름)
  const [status, setStatus] = useState(AsyncStatus.IDLE);
  const vTitle = useInput();
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const username = useAuthStore(state=>state.username);
 
  // 2. pno 파라미터를 읽어와 post를 fetch
  const [params] = useSearchParams();
  let pno = convertToInt(params.get('pno'), null);
  const {data, error, isLoading } = useSWR(['pno', pno], ()=>read(pno));

  // 3. 파생 상태 : 로그인 여부 및 작성자 여부
  const isSubmitting = status === AsyncStatus.SUBMITTING;
  const isWriter = data && username && data.writer === username;

  // 4. 변경할 수 있는 제목과 내용 상태를 변경
  useEffect(() => {
    if (data) {
      vTitle.setValue(data.title);
      setContent(data.content);
    }
  }, [data]);

  // 5. 글 변경
  const handleUpdatePost =async()=>{
    if (isSubmitting) return;
    setStatus(AsyncStatus.SUBMITTING);

    if (!(vTitle.onBlur())) {
      setStatus(AsyncStatus.IDLE);
      return;
    }
    
    try {
      const requestForm = {title:vTitle.value, content:content, pno:pno};
      await update(requestForm);
      setStatus(AsyncStatus.SUCCESS);
      navigate(`/post/read?pno=${pno}`);
    } catch(err) {
      setStatus(AsyncStatus.FAIL)
    } 
  }

  // 6.  조건 렌더링(conditional rendering)
  if (!pno) return <Navigate to="/" replace />;
  if(isLoading)  return <LoadingSpinner />
  if(error) return <Alert variant='danger'>서버가 응답하지 않습니다</Alert>
  if(!isWriter) return <Navigate to="/" replace />;

  return (
    <>
      <TextField label='제목' name='title' {...vTitle} />
      <ReactQuill theme="snow" name="content" module={modules} value={content} onChange={(value)=>setContent(value)}/>
      <BlockButton label={isSubmitting? "변경 중...":"변 경"} onClick={handleUpdatePost} styleName='primary' disabled={isSubmitting}/>
    </>
  )
}

export default PostUpdate