import taskSchema from "../models/task.js"

export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const duplicateTask = await taskSchema.aggregate([
            { $match: { title: { $regex: `^${title}$`, $options: "i" } } }
        ]);
        if (duplicateTask.length !== 0) {
            return res.status(400).json({
                success: false,
                message: "Task already present!"
            })
        }
        const task = await taskSchema.create({
            title,
            description,
            userId: req.userId
        })
        return res.status(201).json({
            success: true,
            message: "Task created successfully!",
            task
        })

    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


export const getAllTask = async (req, res) => {
    try {
        const tasks = await taskSchema.find({ userId: req.userId });
        if (!tasks) {
            return res.status(401).json({
                success: false,
                message: "No task found!"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Tasks fetched successfully!",
            tasks
        })

    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title = null, description = null } = req.body;
        if (!id || id === " ") {
            return res.status(401).json({
                success: false,
                message: "Task id not found!"
            })
        }
        const previousData = await taskSchema.findOne({ _id: id });
        const updateData = await taskSchema.findOneAndUpdate(
            {
                userId: req.userId,
                _id: id
            },
            {
                title: title || previousData.title,
                description: description || previousData.description,
            },
            { new: true }
        );
        if (!updateData) {
            return res.status(401).json({
                success: false,
                message: "No task found for update",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Task updated successfully!",
            updateData
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === " ") {
            return res.status(401).json({
                success: false,
                message: "Task id not found!"
            })
        }
        const deletedData = await taskSchema.findOneAndDelete(
            {
                userId: req.userId,
                _id: id
            }
        );
        if (!deletedData) {
            return res.status(401).json({
                success: false,
                message: "No task found for delete",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully!",
            deletedData
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}