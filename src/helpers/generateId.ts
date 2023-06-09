import { v4 as uuid } from 'uuid'
import User from '../model/userModel'
import { userModel } from '../types'

export default {
    async generateUserId(): Promise<string[]> {
        let ids: string[] = [`${uuid()}${Date.now()}`, `${uuid()}${Date.now()}`]
        
        let privateId: userModel | null = await User.findByPk(ids[0])
        let publicId: userModel[] = await User.findAll({ where: { public_id: ids[1] } })

        if (!(privateId || publicId.length > 0)) {
            return ids
        }
        return this.generateUserId()
    }
}