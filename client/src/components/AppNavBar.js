import React from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link } from '@reach/router';

const AppNavBar = props => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">{props.appTitle}</Navbar.Brand>
            <Navbar.Toggle />
            <Nav className="mr-auto">
                <Nav.Link href="/">All Pets</Nav.Link>    
                <Nav.Link href="/pets/new">New Pet</Nav.Link>
            </Nav>
        </Navbar>
    )
}

export default AppNavBar
