import React from 'react';
import axios from 'axios';
import { Form, Button, Card, Jumbotron, Table } from 'react-bootstrap';
import { navigate } from '@reach/router';

const ItemSubitems = props => {
    const [validationError, setValidationError] = React.useState("");
    const [selectedItem, setSelectedItem] = React.useState("")
    const [strVal1, setStrVal1] = React.useState("")
    const [strVal2, setStrVal2] = React.useState("")
    const getSelectedItem = () => {
        axios.get(`http://localhost:8000/api/items/${props.id}`)
        .then(response => {
            let item = response.data.result;
            console.log(JSON.stringify(item));
            setSelectedItem(item);
        })
    };
    React.useEffect(() => {
        getSelectedItem();
    },[props.id]);

    const addSubItem = () => {
        let subItem = {
            strVal1: strVal1,
            strVal2: strVal2
        }
        axios.put(`http://localhost:8000/api/items/${props.id}/subitem`, subItem)
            .then(response => {
                if (response.data.status === "succeeded") {
                    getSelectedItem();
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
            <h3>Subitems</h3>
            <Form>
            <Form.Group controlId="strVal1">
                <Form.Label>strVal1</Form.Label>
                <Form.Control type="text" placeholder="Enter strVal1" value={strVal1} onChange={e => setStrVal1(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="strVal2">
                <Form.Label>strVal2</Form.Label>
                <Form.Control type="text" placeholder="Enter strVal2" value={strVal2} onChange={e => setStrVal2(e.target.value)}/>
            </Form.Group>
            <div className="d-flex justify-content-around">
            <Button variant="primary" onClick={addSubItem}>
                Add
            </Button>
            </div>
            <Card.Text className="text-danger">
                {validationError}
            </Card.Text>
            </Form>
            <Table striped bordered hover size="sm">
        <thead>
            <tr>
            <th>strVal1</th>
            <th>strVal2</th>
            </tr>
        </thead>
        <tbody>
            {
                selectedItem.subItems 
                ? selectedItem.subItems.map(p =>
                    <tr key={p._id}>
                    <td>{p.strVal1}</td>
                    <td>{p.strVal2}</td>
                    </tr>
                )
                : <></>
            }
        </tbody>
        </Table>
        </Jumbotron>
    )
}

export default ItemSubitems
