import { Model } from "sequelize";

export interface userModel extends Model {
    public_id: string,
    private_id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    token: string
}
export interface postModel extends Model {
    post_id: string,
    title: string,
    content: string,
    likes:number,
    user: string
}
export interface likeModel extends Model{
    id:number,
    user:string,
    post:number
}

