import React from 'react';
import axios from 'axios';
import { Form, Button, Card, Jumbotron } from 'react-bootstrap';
import { navigate } from '@reach/router';

const PetEdit = props => {
    const [validationError, setValidationError] = React.useState("");
    const [name, setName] = React.useState("")
    const [type, setType] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [skill1, setSkill1] = React.useState("")
    const [skill2, setSkill2] = React.useState("")
    const [skill3, setSkill3] = React.useState("")

    const getSelectedPet = () => {
        axios.get(`http://localhost:8000/api/pets/${props.id}`)
        .then(response => {
            let pet = response.data.result;
            setName(pet.name);
            setType(pet.type);
            setDescription(pet.description);
            setSkill1(pet.skill1);
            setSkill2(pet.skill2);
            setSkill3(pet.skill3);
        })
    };
    React.useEffect(() => {
        getSelectedPet();
    },[props.id]);

    const updatePet = () => {
        let updatedPet = {
            name: name,
            type: type,
            description: description,
            skill1: skill1,
            skill2: skill2,
            skill3: skill3
        }
        axios.patch(`http://localhost:8000/api/pets/${props.id}`, updatedPet)
            .then(response => {
                if (response.data.status === "succeeded") {
                    props.refreshPets();
                    navigate("/");
                } else {
                    setValidationError(JSON.stringify(response.data.message));
                }
            })
            .catch(err => {
                let errors = [];
                console.log(err.response);
                let data = err.response.data;
                for (let key in data.errors) {
                    errors.push(data.errors[key].message);
                }
                setValidationError(errors.join(", "));
            });
    }        
    return (
<Jumbotron>
            <h3>Edit Pet</h3>
            <Form>
            <Form.Group controlId="itemName">
                <Form.Label>Pet Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="type">
                <Form.Label>Pet Type</Form.Label>
                <Form.Control type="text" placeholder="Enter type" value={type} onChange={e => setType(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="description">
                <Form.Label>Pet Description</Form.Label>
                <Form.Control type="text" placeholder="Enter description" value={description} onChange={e => setDescription(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="skill1">
                <Form.Label>Skill 1</Form.Label>
                <Form.Control type="text" placeholder="Enter skill1" value={skill1} onChange={e => setSkill1(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="skill2">
                <Form.Label>Skill 2</Form.Label>
                <Form.Control type="text" placeholder="Enter skill2" value={skill2} onChange={e => setSkill2(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="skill3">
                <Form.Label>Skill 3</Form.Label>
                <Form.Control type="text" placeholder="Enter skill3" value={skill3} onChange={e => setSkill3(e.target.value)}/>
            </Form.Group>
            <div className="d-flex justify-content-around">
            <Button variant="primary" onClick={() => navigate("/")}>
                Cancel
            </Button>
            <Button variant="primary" onClick={updatePet}>
                Submit
            </Button>
            </div>
            <Card.Text className="text-danger">
                {validationError}
            </Card.Text>
            </Form>
        </Jumbotron>
    )
}

export default PetEdit
