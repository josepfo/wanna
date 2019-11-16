import { handleTokenErrors } from './errors/error.service';
import { showError, connectionError } from './errors/error.reducer';
import { store } from '../App';

const config = { url: 'http://192.168.1.14:8000' };

var currentAuthToken;

export function setToken(token) {
	this.currentAuthToken = token;
}

async function auxFetch(method, endpoint, querystring, bodyA, headers) {
	let body;
	if (bodyA != null) {
		body = JSON.stringify(bodyA);
	}

	console.log(endpoint + ' ' + method);
	if (headers.Authorization) {
		console.log(headers.Authorization);
	}

	let string;
	if (querystring == null) {
		string = `${config.url}${endpoint}`;
	} else string = `${config.url}${endpoint}${querystring}`;

	console.log('QS ' + string);
	let response;
	try {
		response = await fetch(string, {
			method,
			body,
			headers,
			credentials: 'same-origin'
		}).catch(err => {
			if (err == 'TypeError: Network request failed') {
				throw new Error();
			}
		});
	} catch (e) {
		console.log('ERRO NA LIGAÇÃO.');
		return null;
	}

	return response;
}

export const ourFetchAuth = async action => {
	const headers = {
		'Content-Type': 'application/json'
	};

	response = await auxFetch(action.method, action.endpoint, null, action.body, headers);
	if (response == null) {
		store.dispatch(connectionError('Network request failed'));
		return;
	}
	return response;
};

function getQueryString(params) {
	var esc = encodeURIComponent;
	return Object.keys(params)
		.map(k => esc(k) + '=' + esc(params[k]))
		.join('&');
}

export const ourFetchWithToken = async action => {
	console.log('fetching');

	let querystring = '';
	if (action.query) {
		querystring = '?' + getQueryString(action.query);
	}
	//const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${this.currentAuthToken}`
	};

	response = await auxFetch(action.method, action.endpoint, querystring, action.body, headers);

	if (response == null) {
		store.dispatch(connectionError('Network request failed'));
		return;
	}

	let data = await response.json();

	if (response.status == 200 || response.status == 304) {
		console.log('Tamanho do que retornou do backend: ' + data.length);
		return data;
	} else {
		if (data == 'Token is expired') {
			return store.dispatch({ type: 'EXPIRED_TOKEN' });
		}

		if (data == 'Invalid token') {
			return store.dispatch({ type: 'INVALID_TOKEN' });
		}

		data = JSON.stringify(data);
		let error = data.replace(/[\[\]"\{\}]+/g, '');

		store.dispatch(showError(error));
		return error;
	}
};
