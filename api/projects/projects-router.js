const express = require("express");
const router = express.Router();
const Project = require("./projects-model");
const Action = require("./../actions/actions-model");

// middleware

// id	number	no need to provide it when creating projects, the database will generate it
// name	string	required
// description	string	required
// completed	boolean	used to indicate if the project has been completed, not required

const validateProjectIdParam = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.get(id);
    if (!project) {
      res.status(404).json({ message: "Invalid Project ID" });
    } else {
      req.project = project;
      next();
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving project from database",
    });
  }
};

const getActionsForProject = async (req, res, next) => {
    try {
        const actions = await Action.get();
        req.actions = actions.filter(action => {
            return action.project_id == req.params.id
        })
        next();
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving actions from database"
        })
    }
}

function validateProject(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing project data" });
  } else if (!req.body.name || !req.body.description) {
    res.status(400).json({ message: "body and description are required" });
  } else {
    next();
  }
}

// endpoints

// [GET] /api/projects sends an array of projects (or an empty array) as the body of the response.
// [GET] /api/projects/:id sends a project with the given id as the body of the response.
// [POST] /api/projects sends the newly created project as the body of the response.
// [PUT] /api/projects sends the updated project as the body of the response.
// [DELETE] /api/projects sends no response body.

router.get("/", (req, res) => {
  Project.get()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server error retrieving projects" });
    });
});

router.get("/:id", validateProjectIdParam, (req, res) => {
  res.status(200).json(req.project);
});

router.get("/:id/actions", validateProjectIdParam, getActionsForProject, (req, res) => {
    res.status(200).json(req.actions)
})

router.post("/", validateProject, (req, res) => {
  Project.insert(req.body)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server error posting new project" });
    });
});

router.put("/:id", validateProject, validateProjectIdParam, (req, res) => {
  Project.update(req.params.id, req.body)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: "Server error updating project" });
    });
});

router.delete("/:id", validateProjectIdParam, (req, res) => {
    Project.remove(req.params.id)
    .then(project => {
        res.status(200).json({ message: "Project deleted." })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: "Server error deleting project" })
    })
})

module.exports = router;
