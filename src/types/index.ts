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
