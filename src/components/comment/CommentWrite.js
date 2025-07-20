import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap'
import useComment from '../../hooks/useComment';
import { add } from '../../utils/commentApi';

const CommentWrite=({pno})=>{
  const textareaRef = useRef();
  const vComment = useComment(textareaRef);

  const write = async(pno)=>{
    const result = vComment.check();
    if(!result) 
      return;
    const requestForm =  {pno: pno, content:textareaRef.current.value};
    try {
      const response = await add(requestForm);
      vComment.update(pno, response.data);
      textareaRef.current.value="";
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <>
      <hr />
      <Form.Group className="mb-3">
        <Form.Label>댓글 작성:</Form.Label>
        <Form.Control as="textarea" rows={5} style={{resize: 'none'}} onBlur={vComment.check} ref={textareaRef} placeholder={vComment.message} />
      </Form.Group>
      <div style={{display:'flex', justifyContent:'right'}} >
        <Button variant='primary' onClick={()=>write(pno)}>작성하기</Button>
      </div>
      <hr />
    </>
  )
};

export default React.memo(CommentWrite);