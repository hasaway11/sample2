import axios from "axios";
import useAuthStore from "../stores/useAuthStore";

const api = axios.create({baseURL: "http://localhost:8080", withCredentials: true });

// 응답을 가로채서 401에 대한 처리를 추가
api.interceptors.response.use(
  // 200인 경우 응답을 그대로 리턴
  response => response,

  // 401인 경우 zustand를 로그아웃 상태로 변경하고
  error => {
    if (error.response && error.response.status === 401) {
      // Zustand는 컴포넌트 바깥에서도 store 상태를 접근할 수 있도록 .getState()를 제공
      useAuthStore.getState().resetUsername();
    }
    // 에러 전파
    return Promise.reject(error);
  }
);

export default api;