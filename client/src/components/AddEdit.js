import React from 'react';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';

const AddEdit = props => {
    const [validationError, setValidationError] = React.useState("");
    const [itemName, setItemName] = React.useState("")
    const [strVal1, setStrVal1] = React.useState("")
    const [strVal2, setStrVal2] = React.useState("")

    const AddItem = () => {
        let newItem = {
            name: itemName,
            strVal1: strVal1,
            strVal2: strVal2
        }
        axios.put("http://localhost:8000/api/items", newItem)
            .then(response => {
                if (response.data.status === "succeeded") {
                    props.refreshItems();
                    setValidationError("");
                    props.setSelectedTab('all_items');
                } else {
                    setValidationError(JSON.stringify(response.data.message));
                }
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
        <Form>
        <Form.Group controlId="itemName">
            <Form.Label>Item Name</Form.Label>
            <Form.Control type="text" placeholder="Enter item name" value={itemName} onChange={e => setItemName(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="strVal1">
            <Form.Label>strVal1</Form.Label>
            <Form.Control type="text" placeholder="Enter strVal1" value={strVal1} onChange={e => setStrVal1(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="strVal2">
            <Form.Label>strVal2</Form.Label>
            <Form.Control type="text" placeholder="Enter strVal2" value={strVal2} onChange={e => setStrVal2(e.target.value)}/>
        </Form.Group>
        <Button variant="primary" >
            Update
        </Button>
        <Button variant="primary" onClick={AddItem}>
            Add
        </Button>
        <Card.Text className="text-danger">
            {validationError}
        </Card.Text>
        </Form>
    )
}

export default AddEdit
