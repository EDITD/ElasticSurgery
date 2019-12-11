import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import {
    AppBar,
    Grid,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListSubheader,
} from '@material-ui/core';

import ShardsDashboard from './ShardsDashboard.jsx';
import NodesDashboard from './NodesDashboard.jsx';
import TasksDashboard from './TasksDashboard.jsx';
import Settings from './Settings.jsx';
import ClustersDashboard from './ClustersDashboard.jsx';
import ClusterSelector from './ClusterSelector.jsx';
import store from './data/store';
import { loadNodes } from './data/nodes/actions';


const clusterRoutes = [
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
        name: "Tasks",
        path: "/tasks",
        component: TasksDashboard,
    },
    {
        name: "Settings",
        path: "/settings",
        component: Settings,
    },
]

const configRoutes = [
    {
        name: "Clusters",
        path: "/clusters",
        component: ClustersDashboard,
    }
]

const routes = clusterRoutes.concat(configRoutes);


class App extends React.Component {
    componentDidMount() {
        store.dispatch(loadNodes());
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
                            </Toolbar>
                        </AppBar>
                        <Drawer
                            variant="permanent"
                            open={true}
                            style={this.styles.drawer}
                        >
                            <div style={this.styles.drawer}>
                                <div style={{padding: 9}}>
                                    <ClusterSelector />
                                </div>
                                <List>
                                    {clusterRoutes.map(route => (
                                        <ListItem button component={Link} key={route.name} to={route.path}>
                                            {route.name}
                                        </ListItem>
                                    ))}
                                </List>
                                <List
                                subheader={
                                    <ListSubheader
                                        component="div"
                                        id="nested-list-subheader"
                                    >
                                      ElasticSurgery Configuration
                                    </ListSubheader>
                                  }
                                >
                                    {configRoutes.map(route => (
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
