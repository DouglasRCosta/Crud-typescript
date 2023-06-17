import Sequelize from "sequelize";
import db from "../database/mysql";
import { likeModel } from "../types";


const Like = db.define<likeModel>('like', {
    id:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull: false
    },
    post: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    user: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
})

Like.sync()

export default Like