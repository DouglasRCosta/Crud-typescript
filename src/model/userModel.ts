import Sequelize from "sequelize";
import db from "../database/mysql";
import { userModel } from "../types";

const User = db.define<userModel>("user", {

    private_id: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    }, public_id: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    }
})

User.sync()
export default User