const { Post } = require('../models');
const { Photo } = require('../models');
const { UserPost } = require('../models');
const { Comment } = require('../models');
const { SavedPost } = require('../models');
var fs = require('fs');
var cloudinary = require('cloudinary').v2;
const httpStatus = require('http-status');

cloudinary.config({
	cloud_name: 'dc7hjsttf',
	api_key: '336844426425166',
	api_secret: '2TZg-Y8fDx6EtXZL2vJv61Ymvnk',
});

/**
 * Returns Upload photo
 * @public
 */
exports.create = async (req, res, next) => {
	try {
		const post = await Post.create({
			description: req.body.description,
			genre: req.body.genre,
			price: req.body.price,
			isAvailable: req.body.isAvailable,
			idUser: req.user.username,
			color: req.body.color,
			category: req.body.category,
			size: req.body.size,
			brand: req.body.brand,
		});

		for (var i = 0; i < req.body.imageData.length; i++) {
			var uploadStr = 'data:image/jpeg;base64,' + req.body.imageData[i];

			let result;
			try {
				result = await cloudinary.uploader.upload(uploadStr);
			} catch (e) {
				return next(e);
			}

			if (result != null) {
				const photo = await Photo.create({
					photoData: result.url,
					photoType: 'image/jpeg',
				});

				await photo.setPost(post);
			}
		}
		return res.sendStatus(200);
	} catch (e) {
		next(e);
	}
};

/**
 * Returns Get feed
 * @public
 */
exports.feed = async (req, res, next) => {
	try {
		list = await Post.feed(req.query.page, req.user.username);
		return res.status(httpStatus.OK).json(list);
	} catch (e) {
		next(e);
	}
};

/**
 *
 * Creates a UserPost which represents Like/Dislike
 * @public
 */

exports.createVote = async (req, res, next) => {
	try {
		var user = null;
		user = await UserPost.findOne({
			where: {
				user_id: req.user.username,
				post_id: req.body.idPost,
			},
		});
		if (!user) {
			await UserPost.create({
				likeTimeStamp: new Date(),
				user_id: req.user.username,
				post_id: req.body.idPost,
				type: req.body.type,
			});
			return res.sendStatus(200);
		} else {
			await UserPost.update(
				{ type: req.body.type },
				{
					where: {
						user_id: req.user.username,
						post_id: req.body.idPost,
					},
					returning: true,
					plain: true,
				},
			);
			return res.sendStatus(200);
		}
	} catch (e) {
		next(e);
	}
};

/**
 *
 * Removes a UserPost
 */

exports.removeVote = async function removeVote(req, res, next) {
	try {
		await UserPost.destroy({
			where: {
				post_id: req.body.idPost,
				user_id: req.user.username,
			},
		});
		return res.sendStatus(200);
	} catch (e) {
		next(e);
	}
};

/**
 *
 * Creates a comment
 */

exports.createComment = async (req, res, next) => {
	try {
		await Comment.create({
			commentText: req.body.commentData,
			idUser: req.user.username,
			idPost: req.body.idPost,
		});
		return res.sendStatus(200);
	} catch (e) {
		next(e);
	}
};

/**
 * Deletes a comment
 */

exports.removeComment = async (req, res, next) => {
	try {
		await Comment.destroy({
			where: {
				id: req.body.idComment,
			},
		});
		return res.sendStatus(200);
	} catch (e) {
		next(e);
	}
};

/*
 * Returns a post information
 */

exports.get = async (req, res, next) => {
	try {
		list = await Post.getPostInfo(req.params.idPost, req.user.username);
		return res.json(list);
	} catch (e) {
		next(e);
	}
};

/**
 *
 * Deletes a post
 *
 */

exports.remove = async (req, res, next) => {
	try {
		await Post.destroy({
			where: {
				id: req.params.idPost,
			},
		});
		return res.sendStatus(200);
	} catch (e) {
		next(e);
	}
};

/**
 *
 * Edits a post with the given values
 */

exports.update = async (req, res, next) => {
	try {
		const entries = Object.entries(req.body);
		const data = {};
		for (i = 0; i < entries.length; i++) {
			if (entries[i][1] != 'null') {
				data[entries[i][0]] = entries[i][1];
			}
		}
		await Post.update(data, { where: { id: req.params.idPost } });
		return res.sendStatus(200);
	} catch (e) {
		next(e);
	}
};
/***
 * marks a post as unavailable
 */

exports.markUnavailable = async (req, res, next) => {
	try {
		await Post.update(
			{ isAvailable: 'false' },
			{ where: { id: req.params.idPost } },
		);
		return res.sendStatus(200);
	} catch (e) {
		next(e);
	}
};

/**
 *
 *  Returns post comments
 */

exports.getPostComments = async (req, res, next) => {
	try {
		list = await Post.getComments(req.query.idPost);
		return res.json(list);
	} catch (e) {
		next(e);
	}
};

/**
 *
 *  Adds a post in saved posts list
 */

exports.savePost = async (req, res, next) => {
	try {
		await SavedPost.create({
			user_id: req.user.username,
			post_id: req.body.idPost,
		});
		return res.sendStatus(200);
	} catch (e) {
		next(e);
	}
};

/**
 *
 *  Removes a post from saved posts list
 */

exports.unsavePost = async (req, res, next) => {
	try {
		await SavedPost.destroy({
			where: {
				post_id: req.body.idPost,
				user_id: req.user.username,
			},
		});
		return res.sendStatus(200);
	} catch (e) {
		next(e);
	}
};

/**
 * Returns items that according to the category should be displayed in the upper side of the body
 *
 */

exports.getUpperItems = async (req, res, next) => {
	try {
		list = await Post.getUpperItems();
		res.json(list);
	} catch (e) {
		next(e);
	}
};

/**
 * Returns items that according to the category should be displayed in the lower side of the body
 *
 */

exports.getLowerItems = async (req, res, next) => {
	try {
		list = await Post.getLowerItems();
		res.json(list);
	} catch (e) {
		next(e);
	}
};
