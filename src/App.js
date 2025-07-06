import './App.css';
import Header from './fragments/Header';
import Nav from './fragments/Nav';
import Aside from './fragments/Aside';
import Footer from './fragments/Footer';
import AppRoutes from './routes/AppRoutes';
import useAuthStore from './stores/useAuthStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import usePasswordStore from './stores/usePasswordStore';

function App() {
  const location = useLocation();
  const checkAuth = useAuthStore(state=>state.checkAuth);
  const checkPasswordVerified = usePasswordStore(state=>state.checkPasswordVerified);

  // 이동할 때마다 인증 정보와 비밀번호 확인 여부를 업데이트
  useEffect(()=>{
    checkAuth();
    checkPasswordVerified();
  }, [location, checkAuth, checkPasswordVerified]);  

  return (
    <div className="App">
      <Header />
      <Nav />
      <main>
        <Aside />
        <section>
          <AppRoutes />
        </section>
        <Aside />
      </main>
      <Footer />
    </div>
  );
}

export default App;