import axios from "axios";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../../slices/userSlice";

const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [signInInfo, setSignInInfo] = useState({
        email: '',
        password: ''
    });
    const [signingIn, setSigningIn] = useState(false);
    const [err, setErr] = useState({});

    const handleSignIn = (e) => {
        e.preventDefault();
        setSigningIn(true);
        axios.post('/users/login', { user: signInInfo }, { method: 'POST' })
            .then(res => res.data)
            .then(data => {
                setSigningIn(false);
                setErr([]);
                dispatch(setUser(data.user))
                localStorage.setItem('token', data.user.token);
                axios.defaults.headers.common['Authorization'] = 'Token ' + data.user.token
                navigate('/');
            })
            .catch(e => e.response.data.errors)
            .then(errors => {
                setSigningIn(false);
                if (errors && Object.keys(errors).length > 0)
                    setErr([Object.entries(errors)[0][0] + " " + Object.entries(errors)[0][1]])
            });
        // console.log(signInInfo)
    }
    return (
        <Container className="flex-grow-1">
            <Form onSubmit={handleSignIn} className="m-auto my-2 d-flex flex-column align-items-center gap-3 w-50">
                <div>
                    <h1 className="fw-normal">Sign In</h1>
                    <Link to={'/signup'} className="link-success">Need an account?</Link>
                </div>
                {err.length > 0 && <ul className="error fw-bold text-danger align-self-start m-0">
                    {err.map(err => {
                        return <li key={err}>{err}</li>
                    })}
                </ul>}

                <Form.Control disabled={signingIn} value={signInInfo.email} type="email" placeholder="Email" className="rounded-2 p-3" onChange={(e) => {
                    setSignInInfo({ ...signInInfo, email: e.target.value });
                }} />
                <Form.Control disabled={signingIn} value={signInInfo.password} type="password" placeholder="Password" className="rounded-2 p-3" onChange={(e) => {
                    setSignInInfo({ ...signInInfo, password: e.target.value });
                }} />
                <Button type="submit" variant="success" className="align-self-end px-4" size="lg">Sign in</Button>
            </Form>
        </Container>
    );
}

export default SignIn;