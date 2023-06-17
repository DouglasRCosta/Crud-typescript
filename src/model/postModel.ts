import Sequelize from "sequelize";
import db from "../database/mysql";
import { postModel } from "../types";


const Post = db.define<postModel>('post', {
    post_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,

    },
    content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    likes:{
        type: Sequelize.DataTypes.INTEGER
    },
    user: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName:'posts'
})

Post.sync()

export default Post