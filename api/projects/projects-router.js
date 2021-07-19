const express = require('express');

const Projects = require('../projects/projects-model');
const router = express.Router();

router.get('/',
  (req, res) => {
    Projects.get()
      .then(projects => {
        if (!projects) {
          console.log('one empty array');
          return [];
        } else {
          console.log(projects)
          res.json(projects);
        }
      })
      .catch(error => res.status(500).json({
        message: 'unable to return projects',
        stack: error.stack,
      }));
  });

router.get('/:id',
  async (req, res) => {
    try {
      const project = await Projects.get(req.params.id);
      if (!project) {
        res.status(404).json({ message: 'unable to find project' });
      } else {
        res.json(project);
      }
    } catch (error) {
      res.status(500).send('unable to complete request').json({ stack: error.stack });
    }
  });

router.post('/',
  async (req, res) => {
    try {
      const {description, name} = req.body;
      if (!name || !description) {
        res.status(400).json({ message: 'unable to add project, please check that you have provided a name, and description' });
      } else {
       const newProject =  await Projects.insert({name, description});
       res.json(newProject)
      }
    } catch (error) {
      res.status(500).send('unable to complete request').json({ stack: error.stack });
    }
  })
module.exports = router;
// Write your "projects" router here!
