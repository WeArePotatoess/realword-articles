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
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './slices/userSlice';
import Editor from './layouts/Editor';


function App() {
  axios.defaults.baseURL = "https://api.realworld.io/api";
  axios.defaults.headers.common['Authorization'] = "Token " + (localStorage.getItem('token') != null ? localStorage.getItem('token') : '');


  const dispatch = useDispatch();


  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    axios.get('/user', { cancelToken: source.token })
      .then(res => res.data)
      .then(data => {
        dispatch(setUser(data.user));
      })
      .catch(err => { if (!axios.isCancel(err)) console.log(err) });
    return () => { source.cancel(); }
  }, [dispatch])

  return (
    <div className="App d-flex flex-column">
      <Container className='w-75'>
        <Header />
      </Container>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Navigate to={'/'} />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/editor' element={<Editor />} />
        <Route path='/editor/:slug' element={<Editor />} />
        <Route path='/:username' element={<UserProfile />} />
        <Route path='/article/:slug' element={<ArticleDetail />} />
        <Route path='/*' element={<Navigate to={'/'} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
