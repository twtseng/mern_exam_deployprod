import React from 'react'
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

const ItemList = props => {
    const deleteItem = player_id => {
        axios.delete(`http://localhost:8000/api/items/${player_id}`)
            .then(response => {
                if (response.data.status === "succeeded") {
                    props.refreshItems();
                } 
            })
    }     
    return (
        <Table striped bordered hover size="sm">
        <thead>
            <tr>
            <th>Name</th>
            <th>strVal1</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {
                props.items.map(p =>
                    <tr>
                    <td>{p.name}</td>
                    <td>{p.strVal1}</td>
                    <td><Button onClick={() => deleteItem(p._id)}>Edit</Button>  <Button onClick={() => deleteItem(p._id)}>Delete</Button></td>
                    </tr>
                )
            }
        </tbody>
        </Table>
    )
}

export default ItemList
