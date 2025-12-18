import yup from "yup";

export const taskValidateSchema = yup.object({
    title: yup
        .string()
        .trim()
        .required()
        .min(3, "Title should be atleast 3 characters long!")
        .max(20, "Title must be atmax 25 characters long!"),
    description: yup
        .string()
        .trim()
        .required(),
});

export const validateTask = (schema) => async (req, res, next) => {
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
