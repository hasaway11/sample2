import { Button } from 'react-bootstrap'
import useComment from '../../hooks/useComment'
import useAuthStore from '../../stores/useAuthStore';
import React from 'react';

const CommentList =({comments})=>{
	const loginId = useAuthStore(state=>state.username);
	const {onRemove} = useComment();

  return (
		<>
		{
			comments.map(comment=>{
				return (
					<div key={comment.cno}>
						<div className='upper'style={{display:"flex", justifyContent: "space-between"}}>
							<div>
								<strong>{comment.writer}</strong>&nbsp;&nbsp;
								{
									(comment.writer===loginId) && <Button variant="outline-danger" size="sm" onClick={()=>onRemove(comment.cno, comment.pno)}>삭제</Button>
								}			
							</div>
						<div>{comment.writeTime}</div>
						</div>
						<div className='lower'>{comment.content}</div>
						<hr />
					</div>	
				)			
			})
		}
		</>
  )
};

export default React.memo(CommentList);