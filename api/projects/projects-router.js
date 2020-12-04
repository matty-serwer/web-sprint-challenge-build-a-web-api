const express = require("express");
const router = express.Router();
const Project = require("./projects-model");
const mid = require("./../middlewares/middlewares");

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

router.get("/:id", mid.validateProjectIdParam, (req, res) => {
  res.status(200).json(req.project);
});

router.get("/:id/actions", mid.validateProjectIdParam, mid.getActionsForProject, (req, res) => {
    res.status(200).json(req.actions)
})

router.post("/", mid.validateProject, (req, res) => {
  Project.insert(req.body)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server error posting new project" });
    });
});

router.put("/:id", mid.validateProject, mid.validateProjectIdParam, (req, res) => {
  Project.update(req.params.id, req.body)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: "Server error updating project" });
    });
});

router.delete("/:id", mid.validateProjectIdParam, (req, res) => {
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
