import { IpcClient } from 'shared/ipc.js';
import { Site } from 'shared/models.js';

const actionResult = (type, payload) => ({
	type: type,
	payload: payload
});

//action types
export const ADD_SITE = 'ADD_SITE';
export const DELETE_SITE = 'DELETE_SITE';
export const SET_ACTIVE_SITE_ID = 'SET_ACTIVE_SITE_ID';
export const SET_ACTIVE_SITE_BY_INDEX = 'SET_ACTIVE_SITE_BY_INDEX';
export const ACTIVE_SITE_INCR = 'ACTIVE_SITE_INCR';
export const ACTIVE_SITE_DECR = 'ACTIVE_SITE_DECR';


//action creators
export function addSite(site) {
	let addedSite = IpcClient.addSite(new Site(site));

	return actionResult(ADD_SITE, addedSite);
}

export function deleteSite(id) {
	let deletedSite = IpcClient.deleteSite(id);
	
	return actionResult(DELETE_SITE, id);
}

export function setActiveSiteId(id) {
	return actionResult(SET_ACTIVE_SITE_ID, id);
}

export function setActiveSiteByIndex(index) {
	return actionResult(SET_ACTIVE_SITE_BY_INDEX, index);
}

export function activeSiteIncrement() {
	return actionResult(ACTIVE_SITE_INCR);
}

export function activeSiteDecrement() {
	return actionResult(ACTIVE_SITE_DECR);
}