import { Sequelize } from "sequelize";
import config from "./config/index";
import mysql from "mysql2/promise";
const { host, port, username, password, database } = config;
const db = new Sequelize(database, username, password, {
    logging: config.logging,
    host: host,
    port: parseInt(port),
    dialect: config.dialect || 'mysql'

});


export async function initialize() {

    const connection = await mysql.createConnection({
        host,
        port: parseInt(port),
        user: username,
        password,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

}

export default  db ;