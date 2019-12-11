import { combineReducers } from 'redux';
import { reducer as shards } from './shards/reducer';
import { reducer as nodes } from './nodes/reducer';
import { reducer as clusters } from './clusters/reducer';
import { reducer as settings } from './settings/reducer';
import { reducer as tasks } from './tasks/reducer';
import { reducer as indices } from './indices/reducer';

export default combineReducers({ shards, nodes, clusters, settings, tasks, indices });
