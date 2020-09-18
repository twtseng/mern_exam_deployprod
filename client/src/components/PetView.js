import React from 'react';
import axios from 'axios';
import { Form, Button, Card, Jumbotron, Table } from 'react-bootstrap';
import { navigate } from '@reach/router';

const PetView = props => {
    const [validationError, setValidationError] = React.useState("");
    const [selectedPet, setSelectedPet] = React.useState("")
    const getSelectedPet = () => {
        axios.get(`http://localhost:8000/api/pets/${props.id}`)
        .then(response => {
            let item = response.data.result;
            console.log(JSON.stringify(item));
            setSelectedPet(item);
        })
    };
    React.useEffect(() => {
        getSelectedPet();
    },[props.id]);

    const addLike = () => {

    }        
    return (
        <Jumbotron>
            <h3>Details about: {selectedPet.name}</h3>
            <Button onClick={() => { props.deletePet(props.id); alert(`Thank you for adopting ${selectedPet.name}!`); navigate("/");}} >Adopt {selectedPet.name}</Button>
            <Table striped bordered hover size="sm">
                <tbody>
                    <tr>
                        <th>Pet type:</th>
                        <td>{selectedPet.type}</td>
                    </tr>
                    <tr>
                        <th>Description:</th>
                        <td>{selectedPet.description}</td>
                    </tr>
                    <tr>
                        <th>Skills:</th>
                        <td>{selectedPet.skill1} {selectedPet.skill2} {selectedPet.skill3}</td>
                    </tr>
                    <tr>
                        <td><Button>Like</Button></td>
                        <td>{selectedPet.likes} like(s)</td>
                    </tr>
                </tbody>
            </Table>
        </Jumbotron>
    )
}

export default PetView
