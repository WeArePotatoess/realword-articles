import { Field, Form, Formik } from "formik";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../slices/userSlice";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useRef } from "react";

const Settings = () => {
    const user = useSelector(state => state.user.value);
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const updateSettingsButton = useRef();

useEffect(()=>{
if(!user) navigator('/');
},[navigator,user])

    const handleSubmit = (values) => {
        updateSettingsButton.current.setAttribute('disabled', true);
        axios.put('/user', { user: values })
            .then((res) => res.data)
            .then(data => {
                dispatch(setUser(data.user))
                localStorage.setItem('token', data.user.token);
                Swal.fire({ title: 'Settings updated', icon: 'success', timer: 2000 }).then(() => updateSettingsButton.current.removeAttribute('disabled'))
            })
            .catch(err => { console.log(err); updateSettingsButton.current.removeAttribute('disabled') })
    }
    const handleLogout = () => {
        localStorage.clear();
        dispatch(setUser());
        axios.defaults.headers.common['Authorization'] = '';
        navigator('/');
    }

    return (
        <Container className="w-75 flex-grow-1 text-center">
            {user &&
                <Formik onSubmit={(value) => handleSubmit(value)} initialValues={{ email: '', password: '', username: user.username, bio: user.bio ? user.bio : '', image: user?.image }}>
                    <Form className="w-75 m-auto border-bottom pb-3 mt-5 d-flex flex-column align-items-center gap-3">
                        <h1 className="fw-light">Your Settings</h1>
                        <Field className={'form-control fs-4'} id='image' name='image' placeholder='URL of profile picture' />
                        <Field className={'form-control fs-4'} id='username' name='username' placeholder='Your Name' />
                        <Field as={'textarea'} rows={4} type='text-area' className={'form-control fs-4'} id='bio' name='bio' placeholder='Short bio about you' />
                        <Field type='email' className={'form-control fs-4'} id='email' name='email' placeholder='Email' />
                        <Field type='password' className={'form-control fs-4'} id='password' name='password' placeholder='Password' />
                        <Button ref={updateSettingsButton} className="align-self-end" variant="success" type="submit">Update Settings</Button>
                    </Form>
                </Formik>}
            <Button onClick={handleLogout} variant="outline-danger" className="mt-2" >Or click here to logout.</Button>
        </Container>
    );
}

export default Settings;