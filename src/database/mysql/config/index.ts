import dotenv from 'dotenv'
 
dotenv.config()

export default {
    database: process.env.DATABASE_MYSQL as string,
    username: process.env.USERNAME_MYSQL as string,
    password: process.env.PASSWORD_MYSQL as string,
    dialect: process.env.DIALECT_MYSQL as   'mysql',
    port: process.env.PORT_MYSQL as string ,
    host: process.env.HOST_MYSQL as string,
    logging: false as boolean,
    sync: true as boolean

}