import axios from "axios";
import useAuthStore from "../stores/useAuthStore";

const api = axios.create({baseURL: "http://localhost:8080", withCredentials: true });

// 응답을 가로채서 인증 오류에 대한 처리를 추가
// - 왜 필요? 예를 들어 글쓰기 작업창에서 글 작성에 30분이 필요했다고 하면 
//   -> 글을 작성하면 서버 응답은 401(로그인이 풀렸으니까)
//   -> 하지만 클라이언트 store에서는 여전히 로그인 상태
// - 서버 응답이 200인 경우 그대로 리턴한다, 401인 경우 store의 로그인 상태를 바꾸고 오류를 전파한다

api.interceptors.response.use(
  // 200인 경우 응답을 그대로 리턴
  response => response,

  // 401인 경우 zustand를 로그아웃 상태로 변경하고
  error => {
    if (error.response && error.response.status === 401) {
      // Zustand는 컴포넌트 바깥에서도 store 상태를 접근할 수 있도록 .getState()를 제공
      useAuthStore.getState().setLogout();
    }
    // 에러 전파
    return Promise.reject(error);
  }
);

export default api;