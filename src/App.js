import { Container } from 'react-bootstrap';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './layouts/SignUp';
import SignIn from './layouts/SignIn';
import axios from 'axios';
import Home from './layouts/Home';
import Reference from './components/Reference';
import UserProfile from './layouts/UserProfile';

function App() {
  axios.defaults.baseURL = "https://api.realworld.io/api";
  axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');



  
  return (
    <div className="App d-flex flex-column">
      <Container>
        <Header />
      </Container>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Navigate to={'/'} />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/:username' element={<UserProfile />} />
        <Route path='/*' element={<Navigate to={'/'} />} />
      </Routes>
      <Reference />
      <Footer />
    </div>
  );
}

export default App;
