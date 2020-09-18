import React from 'react';
import { Container } from 'react-bootstrap';
import { Router, Link, navigate } from '@reach/router';
import axios from 'axios';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppNavBar from './components/AppNavBar';
import PetList from './components/PetList';
import PetAdd from './components/PetAdd';
import PetEdit from './components/PetEdit';
import PetView from './components/PetView';

function App() {
  const [socket] = React.useState(() => io(":8000"));
  const [pets, setPets] = React.useState([]);
  const refreshPets = () => {
    axios.get("http://localhost:8000/api/pets")
    .then(response => setPets(response.data.result))
  }
  const deletePet = petId => {
    axios.delete(`http://localhost:8000/api/pets/${petId}`)
        .then(response => {
            if (response.data.status === "succeeded") {
                refreshPets();
            } 
        })
  } 

  React.useEffect(() => {
    refreshPets();
    socket.on('new_message_from_server', msg => {
      //setChatMessages(prevMessages => { return [msg, ...prevMessages]})
    });
  },[]);

  return (
    <div className="App">
      <AppNavBar
        appTitle="Pet Shelter Mern Exam"
        />
        <Container>
          <Router>
            <PetList path="/" pets={pets} refreshPets={refreshPets} deletePet={deletePet}/>
            <PetAdd path="/pets/new" refreshPets={refreshPets}/>
            <PetEdit path="/pets/:id/edit" refreshPets={refreshPets}/>
            <PetView path="/pets/:id" deletePet={deletePet}/>
          </Router>
        </Container>
    </div>
  );
}

export default App;
