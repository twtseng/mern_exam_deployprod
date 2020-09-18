import React from 'react';
import axios from 'axios';
import { Form, Button, Card, Jumbotron } from 'react-bootstrap';
import { navigate } from '@reach/router';

const ItemAdd = props => {
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
            <h3>Add New Item</h3>
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
            <div className="d-flex justify-content-around">
            <Button variant="primary" onClick={() => navigate("/")}>
                Cancel
            </Button>
            <Button variant="primary" onClick={AddItem}>
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

export default ItemAdd
