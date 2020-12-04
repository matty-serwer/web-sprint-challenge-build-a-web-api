const validateActionId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const action = await Action.get(id)
        if (!action) {
            res.status(404).json({ message: "Invalid Action ID"})
        } else {
            req.action = action
            next();
        }
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving action from database"
        })
    }
}

const validateProjectId = async (req, res, next) => {
    const id = req.body.project_id;
    try {
        const project = await Project.get(id)
        if (!project) {
            res.status(404).json({ message: "Invalid project_id"})
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving project from database"
        })
    }
}

function validateAction(req, res, next) {
    if(!req.body) {
        res.status(400).json({ message: "Missing action data" })
    }
    if(!req.body.project_id || !req.body.description || !req.body.notes) {
        res.status(400).json({ message: "description, notes, and project_id are required"})
    }
    if(req.body.description.length > 128) {
        res.status(400).json({ message: "description can be a max 128 characters."})
    }
    next();
}

module.exports = {
    validateActionId,
    validateProjectId,
    validateAction
}