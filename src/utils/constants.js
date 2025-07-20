export const AsyncStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAIL: 'fail',
  SUBMITTING: 'submitting'
};

export const modules = {
  toolbar: {
    container: [['image'], [{ header: [1, 2, 3, 4, 5, false] }], ['bold', 'underline']]
  }
};

export const convertToInt=(param, result)=>{
  const num = parseInt(param, 10);
  return (num >= 1) ? num : result;
}

export const Patterns = {
  USERNAME: {
    regexp: /^[0-9a-z]{6,10}$/,
    message: "아이디는 소문자와 숫자 6~10자입니다"
  },
  PASSWORD: {
    regexp: /^[0-9a-z]{6,10}$/,
    message: "비밀번호는 영숫자 6~10자입니다"
  },
  EMAIL: {
    regexp: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
    message: "이메일을 올바르게 입력해주세요"
  },
}