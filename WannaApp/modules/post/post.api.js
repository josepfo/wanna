import { ourFetchWithToken } from '../api';
import { isAvailable } from 'expo/build/AR';

export const feed = nrPage => {
	const config = {
		endpoint: '/v1/post/feed',
		method: 'GET',
		query: {
			page: nrPage
		}
	};
	return ourFetchWithToken(config);
};

export const like = (idPost, type) => {
	const config = {
		endpoint: '/v1/post/createUserPost',
		method: 'POST',
		body: {
			idPost: idPost
		}
	};
	return ourFetchWithToken(config);
};

export const getComments = idPost => {
	const config = {
		endpoint: '/v1/post/getComments',
		method: 'POST',
		body: {
			idPost: idPost
		}
	};
	return ourFetchWithToken(config);
};

export const comment = (idPost, type) => {
	const config = {
		endpoint: '/v1/post/comment',
		method: 'POST',
		body: {
			idPost: idPost
		}
	};
	return ourFetchWithToken(config);
};

export const deleteComment = (idPost, type) => {
	const config = {
		endpoint: '/v1/post/deleteComment',
		method: 'POST',
		body: {
			idPost: idPost
		}
	};
	return ourFetchWithToken(config);
};

export const getPost = idPost => {
	const config = {
		endpoint: '/v1/post/',
		method: 'GET',
		params: {
			idPost: idPost
		}
	};
	return ourFetchWithToken(config);
};

export const markPost = (idPost, type) => {
	const config = {
		endpoint: '/v1/post/markUnavailable',
		method: 'POST',
		body: {
			idPost: idPost
		}
	};
	return ourFetchWithToken(config);
};

export const createPost = (
	genre,
	clothe,
	color,
	size,
	price,
	images,
	description = 'Muito leite'
) => {
	const config = {
		endpoint: '/v1/post/createPost',
		method: 'POST',
		body: {
			description: description,
			price: price,
			category: clothe,
			color: color,
			imageData: images,
			size: size
		}
	};
	return ourFetchWithToken(config);
};

export const editPost = idPost => {
	const config = {
		endpoint: '/v1/post/editPost',
		method: 'POST',
		body: {
			idPost: idPost
		}
	};
	return ourFetchWithToken(config);
};

export const deleteFilter = idFilter => {
	const config = {
		endpoint: '/v1/filter/deleteFilter',
		method: 'POST',
		body: {
			idFilter: idFilter
		}
	};
	return ourFetchWithToken(config);
};
