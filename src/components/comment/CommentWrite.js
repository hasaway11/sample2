import React from 'react';
import { Button, Form } from 'react-bootstrap'
import useComment from '../../hooks/useComment';

const CommentWrite=({pno})=>{
  const vComment = useComment();
  const {value, onChange, onBlur, message, onWrite} = vComment;

  return (
    <>
      <hr />
      <Form.Group className="mb-3">
        <Form.Label>댓글 작성:</Form.Label>
        <Form.Control as="textarea" rows={5} style={{resize: 'none'}} placeholder={message} onChange={onChange} value={value} onBlur={onBlur} />
      </Form.Group>
      <div style={{display:'flex', justifyContent:'right'}} >
        <Button variant='primary' onClick={()=>onWrite(pno)}>작성하기</Button>
      </div>
      <hr />
    </>
  )
};

export default React.memo(CommentWrite);