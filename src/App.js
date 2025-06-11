import './App.css';
import Header from './fragments/Header';
import Nav from './fragments/Nav';
import Aside from './fragments/Aside';
import Footer from './fragments/Footer';
import AppRoutes from './routes/AppRoutes';
import useAuthStore from './stores/useAuthStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const checkAuth = useAuthStore(state=>state.checkAuth);

  useEffect(()=>{
    checkAuth();
  }, [location]);

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