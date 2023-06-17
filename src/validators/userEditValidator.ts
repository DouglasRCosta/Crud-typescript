import { checkSchema } from "express-validator";

export default {
    editUser: checkSchema({

        firstName: {
            isLength: {
                options: { min: 3, max: 50 },
                errorMessage: "O nome deve ter pelo menos 3 caracteres e máximo 50",
            },
            trim: true,
            optional: true

        },
        lastName: {
            isLength: {
                options: { min: 3, max: 50 },
                errorMessage: "O nome deve ter pelo menos 3 caracteres e máximo 50",
            },
            trim: true,
            optional: true
        },
        email: {
            isEmail: {
                errorMessage: "Digite um email válido",
            }, 
            isLength: {
                options: { min: 6, max: 250 },
                errorMessage: "email deve ter pelo menos 6 caracteres e máximo 250",
            },
            optional: true
        },
        password: {
            isLength: {
                options: { min: 6, max: 250 },
                errorMessage: "A senha deve ter pelo menos 6 caracteres e máximo 250",
            },
            optional: true
            //   matches: {
            //     options: /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
            //     errorMessage:
            //       "A senha deve conter apenas letras, números e caracteres especiais",
            //   },
        },

    })
}