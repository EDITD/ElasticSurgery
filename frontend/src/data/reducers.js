import { combineReducers } from 'redux';
import { reducer as shards } from './shards/reducer';
import { reducer as nodes } from './nodes/reducer';

export default combineReducers({ shards, nodes });
