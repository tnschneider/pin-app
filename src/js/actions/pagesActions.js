import { IpcClient } from 'shared/ipc.js';
import { Page } from 'shared/models.js';

const actionResult = (type, payload) => ({
	type: type,
	payload: payload
});

//action types
export const ADD_PAGE = 'ADD_PAGE';
export const DELETE_PAGE = 'DELETE_PAGE';
export const SET_ACTIVE_PAGE_ID = 'SET_ACTIVE_PAGE_ID';
export const SET_ACTIVE_PAGE_BY_INDEX = 'SET_ACTIVE_PAGE_BY_INDEX';
export const ACTIVE_PAGE_INCR = 'ACTIVE_PAGE_INCR';
export const ACTIVE_PAGE_DECR = 'ACTIVE_PAGE_DECR';


//action creators
export function addPage(page) {
	let addedPage = IpcClient.addPage(new Page(page));

	return actionResult(ADD_PAGE, addedPage);
}

export function deletePage(id) {
	let deletedPage = IpcClient.deletePage(id);
	
	return actionResult(DELETE_PAGE, id);
}

export function setActivePageId(id) {
	return actionResult(SET_ACTIVE_PAGE_ID, id);
}

export function setActivePageByIndex(index) {
	return actionResult(SET_ACTIVE_PAGE_BY_INDEX, index);
}

export function activePageIncrement() {
	return actionResult(ACTIVE_PAGE_INCR);
}

export function activePageDecrement() {
	return actionResult(ACTIVE_PAGE_DECR);
}