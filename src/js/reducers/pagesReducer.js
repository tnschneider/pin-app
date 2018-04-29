import { IpcClient } from 'shared/ipc.js';
import { ADD_PAGE,
		 DELETE_PAGE,
		 SET_ACTIVE_PAGE_ID,
		 SET_ACTIVE_PAGE_BY_INDEX,
		 ACTIVE_PAGE_INCR,
		 ACTIVE_PAGE_DECR, 
		 UPDATE_PAGE_URL,
		 SET_SORT_ORDER } from '../actions/pagesActions.js';

const pages = IpcClient.getPages();

const INITIAL_STATE = { pages: pages || [], activePageId: pages.length > 0 ? pages[0].id : null };

export default function(state = INITIAL_STATE, action) {
	const oldState = state;

	const updateState = (newState) => Object.assign({}, oldState, newState);

	const getPageIdFromIndex = (index) => oldState.pages[index].id;

	const getActivePageIndex = () => oldState.pages.findIndex(x => x.id === oldState.activePageId);

	let index;

	switch(action.type) {
		case ADD_PAGE:
			state.pages.push(action.payload);
			return updateState({ pages: state.pages });

		case DELETE_PAGE:
			let newPageId = state.activePageId !== action.payload 
								? state.activePageId 
								: (state.pages.find(x => x.id !== action.payload) || {}).id;

			return updateState({
				activePageId: newPageId,
				pages: state.pages.filter(x => x.id !== action.payload)
			});

		case UPDATE_PAGE_URL:
			let updatedPage = state.pages.find(x => x.id === action.payload.id);
			if (updatedPage) updatedPage.url == action.payload.url;

			return updateState({ pages: state.pages });
			  
		case SET_ACTIVE_PAGE_ID:
			return updateState({ activePageId: action.payload });

		case SET_ACTIVE_PAGE_BY_INDEX:
			let index = action.payload;

			if (index >= 0 && state.pages.length > index) {
				return updateState({ activePageId: state.pages[index].id });
			} 

			return state;
			
		case ACTIVE_PAGE_INCR:
			index = getActivePageIndex();

			if (index < 0) {
				return updateState({ activePageId: getPageIdFromIndex(0) });
			} else if (index < state.pages.length - 1) {
				return updateState({ activePageId: getPageIdFromIndex(index + 1) });
			}

			return state;
			
		case ACTIVE_PAGE_DECR:
			index = getActivePageIndex();

			if (index < 0) {
				return updateState({ activePageId: getPageIdFromIndex(0) });
			} else if (index > 0) {
				return updateState({ activePageId: getPageIdFromIndex(index - 1) });
			}

			return state;

		case SET_SORT_ORDER:
			const sortOrders = action.payload;

			Object.keys(sortOrders).forEach(x => {
				let page = state.pages.find(page => page.id === x);
				if (page) page.sortOrder = sortOrders[x];
			});

			return updateState({ pages: state.pages });

		default:
			return state;

	}
}