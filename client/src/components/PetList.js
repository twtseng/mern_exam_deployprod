import React from 'react'
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { navigate } from '@reach/router';

const PetList = props => {   

    
    return (
        <Table striped bordered hover size="sm">
        <thead>
            <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {
                props.pets.map(p =>
                    <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.type}</td>
                    <td><Button onClick={() => navigate(`/pets/${p._id}`)}>Details</Button> <Button onClick={() => navigate(`/pets/${p._id}/edit`)}>Edit</Button> <Button onClick={() => props.deletePet(p._id)}>Delete</Button></td>
                    </tr>
                )
            }
        </tbody>
        </Table>
    )
}

export default PetList
