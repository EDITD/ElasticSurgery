import React from 'react';
import './App.css';
import { AppBar, Grid, Toolbar, Typography, Drawer, List, ListItem } from '@material-ui/core';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import ShardsDashboard from './ShardsDashboard.jsx';
import NodesDashboard from './NodesDashboard.jsx';
import Settings from './Settings.jsx';
import ClusterSelector from './ClusterSelector.jsx';
import store from './data/store';
import { loadNodes } from './data/nodes/actions';

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
                                <Grid container alignItems="center" justify="space-between" direction="row">
                                    {routes.map((route, index) => (
                                        <Route
                                            key={route.name}
                                            index={index}
                                            render={() => (
                                                <Grid item>
                                                    <Typography component="h1" variant="h6" color="inherit" noWrap>
                                                        ElasticSurgery - {route.name}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            path={route.path}
                                            exact={route.exact}
                                        />
                                    ))}
                                    <Grid item>
                                        <ClusterSelector />
                                    </Grid>
                                </Grid>
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
                                        <ListItem button component={Link} key={route.name} to={route.path}>
                                            {route.name}
                                        </ListItem>
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
