/* eslint-disable prefer-destructuring */
const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../../database/config.js')[env];

const db = {};
const basename = path.basename(__filename);

var cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: 'dc7hjsttf',
	api_key: '336844426425166',
	api_secret: '2TZg-Y8fDx6EtXZL2vJv61Ymvnk',
});


const { createFakeUsers } = require('../../database/factories/usersFactory');
const { createFakePosts } = require('../../database/factories/postsFactory');
const { createFakePhotos } = require('../../database/factories/photosFactory');
const { createFakeComments } = require('../../database/factories/commentsFactory');
const { createFakeFollowers } = require('../../database/factories/followersFactory');
const { createFakeLikes } = require('../../database/factories/likesFactory');

if (!config.password) {
	config.password = '';
}

const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	config,
);

sequelize
	.authenticate()
	.then(() => {
		console.log('Conexão com a DB Heroku estabelecida com sucesso.');
	})
	.catch(err => {
		console.error('Não foi possível conectar à DB Heroku:', err);
	});

fs.readdirSync(__dirname)
	.filter(
		file =>
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js',
	)
	.forEach(file => {
		const model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

async function createFakeData(nrPosts) {
	try {
		await cloudinary.api.delete_all_resources();
		await sequelize.sync({ force: true });
		const users = await createFakeUsers(sequelize, 35);
		await db.User.bulkCreate(users, {
			individualHooks: true,
		});
		const posts = await createFakePosts(db, sequelize, nrPosts);
		await db.Post.bulkCreate(posts, {
			individualHooks: true,
		});
		const photos = await createFakePhotos(db, sequelize, nrPosts);
		await db.Photo.bulkCreate(photos, {
			individualHooks: true,
		});
		const comments = await createFakeComments(db, sequelize, 20);
		db.Comment.bulkCreate(comments, {
			individualHooks: true,
		});
		const followers = await createFakeFollowers(db, sequelize, 100);
		db.FollowRelationship.bulkCreate(followers, {
			individualHooks: true,
		});
		const likes = await createFakeLikes(db, sequelize, 100);
		db.UserPost.bulkCreate(likes, {
			individualHooks: true,
		});
	} catch (e) {
		console.log(e);
	}
}

// passar o número de posts a criar como argumento
// createFakeData(30);

module.exports = db;
