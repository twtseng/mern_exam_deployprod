import React from 'react';
import { Container } from 'react-bootstrap';
import { Router, Link, navigate } from '@reach/router';
import axios from 'axios';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppNavBar from './components/AppNavBar';
import UserRegistration from './components/UserRegistration';
import ItemList from './components/ItemList';
import ItemAdd from './components/ItemAdd';
import ItemEdit from './components/ItemEdit';

function App() {
  const [socket] = React.useState(() => io(":8000"));
  const [chatMessages, setChatMessages] = React.useState([]);
  const [chatMessage, setChatMessage] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [requireLogin, setRequireLogin] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const refreshItems = () => {
    axios.get("http://localhost:8000/api/items")
    .then(response => setItems(response.data.result))
  }

  React.useEffect(() => {
    refreshItems();
    socket.on('new_message_from_server', msg => {
      setChatMessages(prevMessages => { return [msg, ...prevMessages]})
    });
    getAuthenticatedUser();
    setDisplayName(Cookies.get('displayname'));
    setUserName(Cookies.get('username'));
    setEmail(Cookies.get('email'));
    // redirect not working on EC2/nginx, fails with 502 bad gateway. Allow disable of registration/login requirement
    if (requireLogin && userName === "UNINITIALIZED") {  
      navigate("/register")
    }
  },[userName, requireLogin]);

  const logoutAuthenticatedUser = () => {
    axios.post("http://localhost:8000/login/logout", {}, { withCredentials: true })
    .then(response => {
      window.location = "/";
    })
    .catch(err => alert(err));
  }
  const getAuthenticatedUser = () => {
    axios.get("http://localhost:8000/login/getauthenticateduser", { withCredentials: true })
    .then(response => {
    })
    .catch(err => alert(err));
  }

  return (
    <div className="App">
      <AppNavBar
        appTitle="Mern Exam App"
        displayName={displayName}
        googleLoginUrl="http://localhost:8000/login/google_redirect"
        githubLoginUrl="http://localhost:8000/login/github_redirect"
        logout={logoutAuthenticatedUser}
        requireLogin={requireLogin}
        setRequireLogin={setRequireLogin}
        />
        <Container>
          <Router>
            <ItemList path="/" items={items} refreshItems={refreshItems}/>
            <ItemAdd path="/item/new" items={items} refreshItems={refreshItems}/>
            <ItemEdit path="/item/:id" items={items} refreshItems={refreshItems}/>
            <UserRegistration path="/register" setUserName={setUserName} userName={userName} email={email}/>
          </Router>
        </Container>
    </div>
  );
}

export default App;
