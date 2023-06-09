import { checkSchema } from "express-validator";

export default {
    editUser: checkSchema({

        firstName: {
            isLength: {
                options: { min: 3 },
                errorMessage: "O nome deve ter pelo menos 3 caracteres",
            },
            trim: true,
            optional: true

        },
        lastName: {
            isLength: {
                options: { min: 3 },
                errorMessage: "O nome deve ter pelo menos 3 caracteres",
            },
            trim: true,
            optional: true
        },
        email: {
            isEmail: {
                errorMessage: "Digite um email válido",
            },
            optional: true
        },
        password: {
            isLength: {
                options: { min: 6 },
                errorMessage: "A senha deve ter pelo menos 6 caracteres",
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