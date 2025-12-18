import yup from "yup";

export const userValidateSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required()
        .min(3, "Name should be atleast 3 characters long!")
        .max(25, "Name must be atmax 25 characters long!"),

    email: yup
        .string()
        .trim()
        .email()
        .required(),
    password: yup
        .string()
        .trim()
        .min(8, "Password should be 8 characters long!")
        .max(12, "Password must be atmax 25 characters long!")
        .required()
});

export const validateUser = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body);
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
