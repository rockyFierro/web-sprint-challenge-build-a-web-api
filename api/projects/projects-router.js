const express = require('express');

const Projects = require('../projects/projects-model');
const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const projects = await Projects.get();
      if (!projects) {
        res.send([]);
      } else {
        res.json(projects);
      }
    } catch (error) {
      res.status(500).json({
        message: 'unable to return projects',
        stack: error.stack,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const { description, name } = req.body;
      if ( !description || !name) {
        res.status(400).json({
          message: "missing a parameter; please check that you have provided a 'description', and 'notes'; please use the same spelling as given here."
        });
      } else {
        const newProject = await Projects.insert(req.body);
        // const added = await Projects.get(req.body.id);
        res.json(newProject);
      }
    } catch (error) {
      res.status(500).json({
        message: 'An internal database error has occured, please contact your provider.',
        stack: error.stack,
      });
    }
  });

router.route('/:id')
  .get(
    async (req, res) => {
      try {
        const project = await Projects.get(req.params.id);
        if (!project) {
          console.log('nothing there...');
          res.status(404).json({
            message: "please provide a proper project id"
          });
        } else {
          console.log(project);
          res.json(project);
        }
      } catch (error) {
        res.status(500).json({
          message: "we do apoligize but we cannot return information at this time.",
          stack: error.stack,
        });
      }
    })
  .put(
    async (req, res) => {
      try {
        const project = await Projects.get(req.params.id);
        if (!project) {
          res.status(404).json({
            message: 'unable to retrieve that id, are you sure it exists?',
          });
        } else {
          const { description, name, completed } = req.body;
          if (!description || !name || !completed) {
            res.status(400).json({
              message: `It looks like there is a missing field. please check that you are providing  
              "name", "description" as they are dispalyed here.`
            });
          } else {
            const updated = await Projects.update(req.params.id, req.body);
            res.json(updated);
          }
        }
      } catch (error) {
        res.status(500).json({
          message: 'unable to complete request, please contact your administrator',
          stack: error.stack
        });
      }
    }
    //returns the updated actiona s the body of the response or a 404, if the request is missing any fields it responds with a 400
  )
  .delete(
    async (req, res) => {
      try{
        const id = await Projects.get(req.params.id);
        if(!id){
          res.status(404).json({
            message: ' there is no project to delete with that id.',
          });
        } else {
          const deleted = await Projects.remove(req.params.id);
          res.status(200).json(deleted);
        }
      } catch (error) {
        res.status(500).json({
          message: ' unable to complete this request',
        });
      }
    }
    //returns no response body
    //if there is no project with the given id it responds with a status code 404
  );

  router.route('/:id/actions')
  .get(
    async (req, res) => {
      try {
        const project = await Projects.get(req.params.id);
        if (!project) {
          console.log('nothing there...');
          res.status(404).json({
            message: "please provide a proper project id"
          });
        } else {
          const projectActions = await Projects.getProjectActions(req.params.id);
          // console.log(project);
          res.json(projectActions);
        }
      } catch (error) {
        res.status(500).json({
          message: "we do apoligize but we cannot return information at this time.",
          stack: error.stack,
        });
      }
    });

    module.exports = router;
// Write your "projects" router here!
