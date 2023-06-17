import { v4 as uuid } from 'uuid'
import User from '../model/userModel'
import { userModel } from '../types'
import { Op } from 'sequelize'

export default {
    async generateUserId(): Promise<string[]> {
        let ids: string[] = [`${uuid()}${Date.now()}`, `${uuid()}${Date.now()}`]
        
        let publicId: userModel[] = await User.findAll({ where: { [Op.or]: [{ public_id: ids[1] }, { private_id: ids[0] }] } })

        if (!(publicId.length > 0)) {
            return ids
        }
        return this.generateUserId()
    }
}