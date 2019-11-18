const { FollowRelationship } = require('../models');
const { User } = require('../models');
const { Post } = require('../models');
const httpStatus = require('http-status');

/**
 * Returns Get logged in user info
 * @public
 */
exports.profileInfo = async (req, res, next) => {
	try {
		list = await User.getProfileInfo(req.user.username);
		return res.status(httpStatus.OK).json(list);
	} catch (e) {
		next(e);
	}
};

/**
 * Returns Get followers list
 * @public
 */
exports.getFollowers = async (req, res, next) => {
	try {
		list = await User.getFollowers(req.user.username);
		list = list.map(e => e.follower_id).join(',');
		res.json(list);
	} catch (e) {
		next(e);
	}
};

/**
 * Returns Get followings list
 * @public
 */
exports.getFollowings = async (req, res, next) => {
	try {
		list = await User.getFollowings(req.user.username);
		list = list.map(e => e.followed_id).join(',');
		res.json(list);
	} catch (e) {
		next(e);
	}
};

/**
 * Returns follow with success
 * @public
 */
exports.follow = async (req, res, next) => {
	try {
		const followPost = await FollowRelationship.create({
			followed_id: req.params.userID,
			follower_id: req.user.username,
		});

		return res.status(httpStatus.CREATED).json(followPost);
	} catch (e) {
		next(e);
	}
};

/**
 * Returns unfollow with success
 * @public
 */
exports.unfollow = async (req, res, next) => {
	followPost = await FollowRelationship.destroy({
		where: {
			followed_id: req.params.userID,
			follower_id: req.user.username,
		},
	})
		.then(function(deletedRecord) {
			if (deletedRecord === 1) {
				res.status(200).json({ message: 'Unfollow successfully!' });
			} else {
				res.status(404).json({
					message: 'You do not follow this page',
				});
			}
		})
		.catch(function(error) {
			res.status(500).json('Erro na operação ' + error);
		});
};

/***
 * Returns the personal informations of a user as well as his posts
 */

exports.userProfileInfo = async function(req, res, next) {
	try {
		list = await User.getProfileInfo(req.params.idUser);
		object = new Object();

		const info = {
			username: list[0].username,
			firstName: list[0].firstName,
			lastName: list[0].lastName,
			rating: list[0].rating,
			avatarData: list[0].avatarData,
		};

		object['info'] = info;

		posts = [];
		for (var i = 1; i < list.length; ) {
			const post = {
				id: list[i].postid,
				photoData: list[i].photoData,
			};

			i += 1;

			if (i > list.length) break;

			posts.push(post);
		}
		object['posts'] = posts;

		return res.status(httpStatus.OK).json(object);
	} catch (e) {
		next(e);
	}
};

/**
 *
 * Returns the list of saved posts *
 *
 * needs rework if post images are required.
 *
 */
exports.getSavedPosts = async (req, res, next) => {
	try {
		list = await Post.getSavedPosts(req.user.username);
		res.json(list);
	} catch (e) {
		next(e);
	}
};
