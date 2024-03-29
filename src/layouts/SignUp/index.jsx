import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import './SignUp.css'
import { useState } from "react";
import axios from "axios";


const SignUp = ({ setUser }) => {

    const [signUpInfo, setSignUpInfo] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [signingUp, setSigningUp] = useState(false);
    const [err, setErr] = useState({});
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        setSigningUp(true);
        axios.post('/users', { user: signUpInfo })
            .then(res => res.data)
            .then(data => {
                setSigningUp(false); setErr([]);
                localStorage.setItem('token', data.user.token);
                setUser(data.user);
                navigate('/');
            })
            .catch(e => e.response.data.errors)
            .then(errors => {
                setSigningUp(false);
                setErr([Object.entries(errors)[0][0] + " " + Object.entries(errors)[0][1]])
            });
        // console.log(signUpInfo)
    }
    return (
        <Container className="flex-grow-1">
            <Form onSubmit={handleSignUp} className="m-auto my-2 d-flex flex-column align-items-center gap-3 w-50">
                <div>
                    <h1 className="fw-normal">Sign Up</h1>
                    <Link to={'/signin'} className="link-success">Have an account?</Link>
                </div>
                {err.length > 0 && <ul className="error fw-bold text-danger align-self-start m-0">
                    {err.map(err => {
                        return <li key={err}>{err}</li>
                    })}
                </ul>}

                <Form.Control disabled={signingUp} value={signUpInfo.username} placeholder="Username" className="rounded-2 p-3" onChange={(e) => {
                    setSignUpInfo({ ...signUpInfo, username: e.target.value });
                }} />
                <Form.Control disabled={signingUp} value={signUpInfo.email} type="email" placeholder="Email" className="rounded-2 p-3" onChange={(e) => {
                    setSignUpInfo({ ...signUpInfo, email: e.target.value });
                }} />
                <Form.Control disabled={signingUp} value={signUpInfo.password} type="password" placeholder="Password" className="rounded-2 p-3" onChange={(e) => {
                    setSignUpInfo({ ...signUpInfo, password: e.target.value });
                }} />
                <Button type="submit" variant="success" className="align-self-end px-4" size="lg">Sign up</Button>
            </Form>
        </Container>
    );
}

export default SignUp;