import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Editor = () => {
    const submitBtn = useRef();
    const navigator = useNavigate();
    const [error, setError] = useState();
    const { slug } = useParams();
    const [article, setArticle] = useState();

    const handleSubmit = (values) => {
        submitBtn.current.setAttribute('disabled', true);

        axios({ url: slug ? `/articles/${slug}` : '/articles', method: slug ? 'PUT' : 'POST', data: { article: slug ? { ...values, tag: undefined } : values } })
            .then(res => res.data)
            .then(data => {
                Swal.fire(
                    {
                        timer: 2000,
                        title: slug ? 'Article updated successfully!' : 'Article published successfully!',
                        icon: 'success'
                    })
                    .then(() => {
                        navigator('/article/' + data.article.slug);
                    })
            })
            .catch(err => {
                console.log(err)
                setError(Object.entries(err.response.data.errors)[0][0] + ' ' + Object.entries(err.response.data.errors)[0][1])
                submitBtn.current.removeAttribute('disabled');
            })
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        if (slug) {
            axios.get('/articles/' + slug, { cancelToken: cancelToken.token })
                .then(res => res.data)
                .then(data => setArticle(data.article))
                .catch(err => {
                    if (!axios.isCancel(err)) console.log(err)
                })
        }
        return () => cancelToken.cancel();
    }, [slug])

    return (
        <Container className="w-75 flex-grow-1">
            {!slug ?
                <Formik onSubmit={value => handleSubmit(value)} initialValues={{ title: '', description: '', body: '', tagList: '' }} >
                    <Form className="w-75 m-auto mt-5 d-flex flex-column gap-3">
                        <Field className='form-control fs-4' name='title' id='title' placeholder='Article Title' />
                        <Field className='form-control fs-6' name='description' id='description' placeholder="What's this articel about?" />
                        <Field as={'textarea'} rows={4} className='form-control fs-6' name='body' id='body' placeholder='Write your article (in markdown)' />
                        <Field className='form-control fs-6' name='tagList' id='tagList' placeholder='Enter tags' />
                        <Button ref={submitBtn} className="align-self-end fs-4" type="submit" variant="success">Publish Article</Button>
                        {error && <p className="fs-5 text-danger">{error}</p>}
                    </Form>
                </Formik>
                :
                (article && <Formik onSubmit={value => handleSubmit(value)} initialValues={{ title: article.title, description: article.description, body: article.body, tagList: '' }} >
                    <Form className="w-75 m-auto mt-5 d-flex flex-column gap-3">
                        <Field className='form-control fs-4' name='title' id='title' placeholder='Article Title' />
                        <Field className='form-control fs-6' name='description' id='description' placeholder="What's this articel about?" />
                        <Field as={'textarea'} className='form-control fs-6' name='body' id='body' placeholder='Write your article (in markdown)' />
                        <Field className='form-control fs-6' name='tagList' id='tagList' placeholder='Enter tags' />
                        <Button ref={submitBtn} className="align-self-end fs-4" type="submit" variant="success">Publish Article</Button>
                        {error && <p className="fs-5 text-danger">{error}</p>}
                    </Form>
                </Formik>)
            }
        </Container>
    );
}

export default Editor;