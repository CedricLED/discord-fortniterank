const sql = require('sqlite');
const path = require('path');

sql.open(path.join(__dirname, './db.sqlite'));

module.exports.sql = sql;
