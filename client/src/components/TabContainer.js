import React from 'react'
import { Tabs, Tab, Sonnet, Col, Nav, Jumbotron } from 'react-bootstrap';

const TabContainer = () => {
    const [selectedTab, setSelectedTab] = React.useState('all_items');

    return (
        <Jumbotron>
            <Tabs acktiveKey={selectedTab} transition={false} id="noanim-tab-example">
                <Tab eventKey="all_items" title="All Items">
                    <h1>All Items</h1>
                </Tab>
                <Tab eventKey="add_edit" title="Add/Edit Item">
                    <h1>Add Edit</h1>
                </Tab>
                <Tab eventKey="chat" title="Chat">
                    <h1>Chat</h1>
                </Tab>
            </Tabs>
        </Jumbotron>
    )
}

export default TabContainer
