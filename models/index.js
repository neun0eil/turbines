import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'fs/promises';
import path from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import json from '../config/config.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = json[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

export default async function () {
  const db = {
    sequelize,
    Sequelize,
  };
  const files = (await fs.readdir(__dirname)).filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  });
  for (const file of files) {
    const init = (await import(pathToFileURL(path.join(__dirname, file)))).default;
    const model = init(sequelize, DataTypes);
    db[model.name] = model;
  }
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  return db;
}
