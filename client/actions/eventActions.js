import axios from 'axios';
import jwt from 'jsonwebtoken';
import { SET_CURRENT_CHANNEL } from './types';

export function setCurrentChannel(channel) {
  return {
    type: SET_CURRENT_CHANNEL,
    channel
  };
}

export function createEvent(events) {
  
  return dispatch => {
  	console.log("avant axios");
    return axios.post('/api/events', events).then(res => {
    	const channel = res.data.channel;
    	//console.log(res.events.user);
    	localStorage.setItem('channel',channel);
    	//setAuthorizationToken(token);
    	//console.log(jwt.decode(channel));
    	dispatch(setCurrentChannel(jwt.decode(channel)));
    
    });
    /*
    const channel = res.data.channel;
    //console.log(res.events.user);
    localStorage.setItem('channel',channel);
    //setAuthorizationToken(token);
    //console.log(jwt.decode(channel));
    dispatch(setCurrentUser(jwt.decode(channel)));*/
  };
}
//