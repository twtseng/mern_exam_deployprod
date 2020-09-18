import React from 'react';
import axios from 'axios';
import { Tabs, Tab, Jumbotron } from 'react-bootstrap';
import ItemList from './ItemList';
import AddEdit from './AddEdit';

const TabContainer = props => {
    const [selectedTab, setSelectedTab] = React.useState("all_items");
    const [items, setItems] = React.useState([]);
    const refreshItems = () => {
      axios.get("http://localhost:8000/api/items")
      .then(response => setItems(response.data.result))
    }
    React.useEffect(() => {
        refreshItems();
    },[])
    return (
        <Jumbotron>
            <Tabs activeKey={selectedTab} transition={false} id="noanim-tab-example" onSelect={(tab) => setSelectedTab(tab)}>
                <Tab eventKey="all_items" title="All Items" >
                    <ItemList refreshItems={refreshItems} items={items} />
                </Tab>
                <Tab eventKey="add_edit" title="Add/Edit Item" >
                    <AddEdit refreshItems={refreshItems} setSelectedTab={setSelectedTab} />
                </Tab>
                <Tab eventKey="chat" title="Chat">
                    <h1>Chat</h1>
                </Tab>
            </Tabs>
        </Jumbotron>
    )
}

export default TabContainer
