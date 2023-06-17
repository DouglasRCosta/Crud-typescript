import { checkSchema } from "express-validator";

export default {
  create: checkSchema({
    title: {
      isLength: {
        options: { min: 3, max: 30 },
        errorMessage: "O título deve ter pelo menos 3 caracteres e máximo 30",
      },
      trim: true,
    },
    content: {
      isLength: {
        options: { min: 3, max: 250 },
        errorMessage: "O texto deve ter pelo menos 3 caracteres e máximo 250",
      },
      trim: true,
    },


  }),
};