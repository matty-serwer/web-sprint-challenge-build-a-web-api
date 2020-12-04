const express = require("express");
const router = express.Router();
const Action = require("./actions-model");
const Project = require("../projects/projects-model");

// [GET] /api/actions sends an array of actions (or an empty array) as the body of the response.
// [GET] /api/actions/:id sends an action with the given id as the body of the response.
// [POST] /api/actions sends the newly created action as the body of the response.
// [PUT] /api/actions sends the updated action as the body of the response.
// [DELETE] /api/actions sends no response body.

// middleware

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

// id	number	no need to provide it when creating posts, the database will automatically generate it
// project_id	number	required, must be the id of an existing project
// description	string	up to 128 characters long, required
// notes	string	no size limit, required. Used to record additional notes or requirements to complete the action
// completed	boolean	used to indicate if the action has been completed, not required

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



// requests

router.get("/", (req, res) => {
  Action.get()
    .then((actions) => {
            res.status(200).json(actions)
    })
    .catch((error) => {
    //   console.log(error);
      res.status(500).json({ message: "Server error retrieving actions" });
    });
});

router.get("/:id", validateActionId, (req, res) => {
    res.status(200).json(req.action);
})

router.post("/", validateAction, validateProjectId, (req, res) => {
    Action.insert(req.body)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(error => {
            // console.log(error)
            res.status(500).json({ message: "Server error posting new action"})
        })
})

router.put("/:id", validateAction, validateActionId, (req, res) => {
    Action.update(req.params.id, req.body)
        .then(action => {
            res.status(201).json(action)
        }) 
        .catch(error => {
            // console.log(error)
            res.status(500).json({ message: "Server error updating action" })
        })
});

router.delete("/:id", validateActionId, (req, res) => {
    Action.remove(req.params.id)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: "Server error deleting action" })
        })
})

module.exports = router;
