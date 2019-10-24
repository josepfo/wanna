/* eslint-disable prefer-destructuring */
const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../../database/config.js')[env];

const db = {};
const basename = path.basename(__filename);

const {
	createFakeDataUsers,
} = require('../../database/factories/usersFactory');
const {
	createFakeDataPosts,
} = require('../../database/factories/postsFactory');
const {
	createFakeDataPhotos,
} = require('../../database/factories/photosFactory');
const {
	createFakeDataComments,
} = require('../../database/factories/commentsFactory');
const {
	createFakeDataCategories,
} = require('../../database/factories/categoriesFactory');

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

// sequelize.sync({ force: true });

// db.User.bulkCreate(createFakeDataUsers(sequelize, 10), { individualHooks: true });

sequelize.sync({ force: true }).then(
	function() {
		db.User.bulkCreate(createFakeDataUsers(sequelize, 10), {
			individualHooks: true,
		});
		db.Post.bulkCreate(createFakeDataPosts(sequelize, 10), {
			individualHooks: true,
		});
		createFakeDataPhotos(sequelize, 10).then(function(value) {
			db.Photo.bulkCreate(value, {
				individualHooks: true,
			});
		});
		db.Comment.bulkCreate(createFakeDataComments(sequelize, 20), {
			individualHooks: true,
		});
		db.Category.bulkCreate(createFakeDataCategories(sequelize, 7), {
			individualHooks: true,
		});
	},
	function() {
		console.log('Erro na sincronização com a BD');
	},
);



module.exports = db;
