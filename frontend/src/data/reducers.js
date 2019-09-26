import { combineReducers } from 'redux';
import { reducer as shards } from './shards/reducer';
import { reducer as nodes } from './nodes/reducer';
import { reducer as clusters } from './clusters/reducer';

export default combineReducers({ shards, nodes, clusters });
