import React from 'react';
import './App.css';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { Provider } from 'react-redux';

import ShardsDashboard from './ShardsDashboard.jsx'
import NodesDashboard from './NodesDashboard.jsx'
import Settings from './Settings.jsx'
import store from './data/store';
import { loadNodes } from './data/nodes/actions';

class App extends React.Component {
    componentDidMount() {
        store.dispatch(loadNodes());
    }

    state = {
        selectedContent: "Home",
    }
    menuClick = name => {
        this.setState({
            selectedContent: name,
        })
    }

    drawerWidth = 240;
    styles = {
        appBar: {
          width: `calc(100% - ${this.drawerWidth}px)`,
          marginLeft: this.drawerWidth,
        },
        drawer: {
          width: this.drawerWidth,
          flexShrink: 0,
        },
        drawerPaper: {
          width: this.drawerWidth,
        },
    }

    welcomeText() {
        return <div>
            "Welcome to ElasticSurgery"
        </div>
    }

    content = [
        {
            name: "Home",
            component: this.welcomeText,
        },
        {
            name: "Shards",
            component: ShardsDashboard,
        },
        {
            name: "Nodes",
            component: NodesDashboard,
        },
        {
            name: "Settings",
            component: Settings,
        }
    ]

    render() {
        const ComponentToRender = this.content.find(components => components.name === this.state.selectedContent).component;

        return (
            <Provider store={store}>
                <div className="App">
                    <AppBar position="static" style={this.styles.appBar}>
                        <Toolbar>
                            <Typography component="h1" variant="h6" color="inherit" noWrap>
                                ElasticSurgery - Dashboard
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="permanent"
                        open={true}
                        style={this.styles.drawer}
                    >
                        <div style={this.styles.drawer}>
                            <List>
                            {this.content.map(item => (
                                <ListItem button key={item.name} onClick={() => this.menuClick(item.name)}>
                                    <ListItemText primary={item.name} />
                                </ListItem>
                            ))}
                            </List>
                        </div>
                    </Drawer>
                    <main>
                        <ComponentToRender />
                    </main>
                </div>
            </Provider>
        );
    }
}

export default App;
