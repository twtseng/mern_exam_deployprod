import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { Link } from '@reach/router';

const AppNavBar = props => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">{props.appTitle}</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
            {
                props.displayName
                ? <Navbar.Text>Signed in as: <Link to="/register">{props.displayName}</Link> <Button variant="outline-primary" onClick={props.logout}>Logout</Button></Navbar.Text>
                : <Navbar.Text><a href={props.googleLoginUrl}>Login with Google</a> | <a href={props.githubLoginUrl}>Login with Github</a></Navbar.Text>
            } | 
            {/* <Button variant="outline-primary" onClick={() => props.requireLogin ? props.setRequireLogin(false) : props.setRequireLogin(true)}>{ props.requireLogin ? "Login Required" : "Login NOT required"}</Button> */}
            </Navbar.Collapse>
        </Navbar>
    )
}

export default AppNavBar
