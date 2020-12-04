const Project = require('./../projects/projects-model');
const Action = require('./../actions/actions-model');

const validateActionIdParam = async (req, res, next) => {
    const { id } = req.params;
    try {
      const action = await Action.get(id);
      if (!action) {
        res.status(404).json({ message: "Invalid Action ID" });
      } else {
        req.action = action;
        next();
      }
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving action from database",
      });
    }
  };
  
  const validateProjectId = async (req, res, next) => {
    const id = req.body.project_id;
    try {
      const project = await Project.get(id);
      if (!project) {
        res.status(404).json({ message: "Invalid project_id" });
      } else {
        next();
      }
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving project from database",
      });
    }
  };
  
  function validateAction(req, res, next) {
    if (!req.body) {
      res.status(400).json({ message: "Missing action data" });
    } else if (!req.body.project_id || !req.body.description || !req.body.notes) {
      res
        .status(400)
        .json({ message: "description, notes, and project_id are required" });
    } else if (req.body.description.length > 128) {
      res
        .status(400)
        .json({ message: "description can be a max 128 characters." });
    } else {
      next();
    }
  }

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

module.exports = {
    validateActionIdParam,
    validateProjectId,
    validateAction,
    validateProjectIdParam,
    getActionsForProject,
    validateProject
}