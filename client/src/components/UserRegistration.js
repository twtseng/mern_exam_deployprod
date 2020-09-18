import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { navigate } from '@reach/router';

const UserRegistration = props => {
    const [validationError, setValidationError] = React.useState("");
    const [userName, setUserName] = React.useState(props.userName);
    const [email, setEmail] = React.useState(props.email);
    const registerUser = () => {
        axios.patch("http://localhost:8000/login/registeruser", { name:userName, email:email }, { withCredentials: true })
        .then(response => {
            props.setUserName(userName);
            window.location = "/";
        })
        .catch(err => {
            let errors = [];
            let data = err.response.data;
            for (let key in data.errors) {
                errors.push(data.errors[key].message);
            }
            setValidationError(errors.join(", "));
        });
    }
    return (
        <Card>
            <Card.Header>Edit username and password</Card.Header>
            <Card.Body>
            <Form>
                <Form.Group controlId="username">
                    <Form.Label>User name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your username" value={userName} onChange={e => setUserName(e.target.value)}/>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)}/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" onClick={registerUser}>
                    Submit
                </Button>
            </Form>
            <Card.Text className="text-danger">
            {validationError}
            </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default UserRegistration
