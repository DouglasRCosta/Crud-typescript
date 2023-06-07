import bcrypt from 'bcrypt'
export default {

    async encript(password:string):Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    },
    async compararHash(password:string, hash:string):Promise<boolean> {
        const resultado = await bcrypt.compare(password, hash);
        return resultado;
    },

}