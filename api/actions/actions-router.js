const express = require("express");
const router = express.Router();
const Action = require("./actions-model");
const mid = require("./../middlewares/middlewares");

// endpoints

router.get("/", (req, res) => {
  Action.get()
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((error) => {
        console.log(error);
      res.status(500).json({ message: "Server error retrieving actions" });
    });
});

router.get("/:id", mid.validateActionIdParam, (req, res) => {
  res.status(200).json(req.action);
});

router.post("/", mid.validateAction, mid.validateProjectId, (req, res) => {
  Action.insert(req.body)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: "Server error posting new action" });
    });
});

router.put("/:id", mid.validateAction, mid.validateActionIdParam, (req, res) => {
  Action.update(req.params.id, req.body)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: "Server error updating action" });
    });
});

router.delete("/:id", mid.validateActionIdParam, (req, res) => {
  Action.remove(req.params.id)
    .then((action) => {
      res.status(200).json({ message: "Action deleted" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server error deleting action" });
    });
});

module.exports = router;
