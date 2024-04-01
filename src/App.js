import { Container } from 'react-bootstrap';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './layouts/SignUp';
import SignIn from './layouts/SignIn';
import axios from 'axios';
import Home from './layouts/Home';
import Settings from './layouts/Settings';
import UserProfile from './layouts/UserProfile';
import ArticleDetail from './layouts/ArticleDetail';
import { useEffect, useState } from 'react';

function App() {
  axios.defaults.baseURL = "https://api.realworld.io/api";
  axios.defaults.headers.common['Authorization'] = "Token " + (localStorage.getItem('token') != null ? localStorage.getItem('token') : '');

  const [user, setUser] = useState();

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    axios.get('/user', { cancelToken: source.token })
      .then(res => res.data)
      .then(data => setUser(data.user))
      .catch(err => console.log(err));
    return () => { source.cancel(); }
  }, [])

  return (
    <div className="App d-flex flex-column">
      <Container className='w-75'>
        <Header user={user} />
      </Container>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Navigate to={'/'} />} />
        <Route path='/login' element={<SignIn setUser={setUser} />} />
        <Route path='/register' element={<SignUp setUser={setUser} />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/:username' element={<UserProfile user={user} />} />
        <Route path='/article/:slug' element={<ArticleDetail user={user} />} />
        <Route path='/*' element={<Navigate to={'/'} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
