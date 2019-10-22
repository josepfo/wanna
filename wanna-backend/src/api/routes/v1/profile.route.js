const router = require('express').Router();
const controller = require('../../controllers/profile.controller');
const rules = require('../../validations/profile.validation');
const validate = require('../../validations/handler');

router
	.route('/')
	/**
	 * @api {get} v1/profile User Profile
	 * @apiDescription Get logged in user profile information
	 * @apiVersion 1.0.0
	 * @apiName UserProfile
	 * @apiGroup User
	 * @apiPermission user
	 *
	 * @apiHeader {String} Authorization User's access token
	 *
	 * @apiSuccess {String}  id         User's id
	 * @apiSuccess {String}  firstName  User's first name
	 * @apiSuccess {String}  lastName   User's last name
	 * @apiSuccess {String}  email      User's email
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
	 */
	.get(controller.profileInfo);

router.route('/follow/:userID').post(validate(rules.follow), controller.follow);

router
	.route('/unfollow/:userID')
	.post(validate(rules.follow), controller.unfollow);

module.exports = router;
