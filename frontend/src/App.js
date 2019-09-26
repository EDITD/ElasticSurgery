import React from 'react';
import './App.css';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import ShardsDashboard from './ShardsDashboard.jsx';
import NodesDashboard from './NodesDashboard.jsx';
import Settings from './Settings.jsx';
import store from './data/store';

const routes = [
    {
        name: "Home",
        path: "/",
        exact: true,
        render: () => "Welcome to ElasticSurgery",
    },
    {
        name: "Shards",
        path: "/shards",
        component: ShardsDashboard,
    },
    {
        name: "Nodes",
        path: "/nodes",
        component: NodesDashboard,
    },
    {
        name: "Settings",
        path: "/settings",
        component: Settings,
    }
]

class App extends React.Component {
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
        content: {
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

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <AppBar position="static" style={this.styles.content}>
                            <Toolbar>
                                {routes.map((route, index) => (
                                    <Route
                                        key={route.name}
                                        index={index}
                                        render={() => (
                                            <Typography component="h1" variant="h6" color="inherit" noWrap>
                                                ElasticSurgery - {route.name}
                                            </Typography>
                                        )}
                                        path={route.path}
                                        exact={route.exact}
                                    />
                                ))}
                            </Toolbar>
                        </AppBar>
                        <Drawer
                            variant="permanent"
                            open={true}
                            style={this.styles.drawer}
                        >
                            <div style={this.styles.drawer}>
                                <List>
                                    {routes.map(route => (
                                        <Link to={route.path} key={route.name}>
                                            <ListItem button>
                                                <ListItemText primary={route.name} />
                                            </ListItem>
                                        </Link>
                                    ))}
                                </List>
                            </div>
                        </Drawer>
                        <main style={this.styles.content}>
                            {routes.map((route, index) => (
                                <Route
                                    key={index}
                                    {...route}
                                />
                            ))}
                        </main>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
