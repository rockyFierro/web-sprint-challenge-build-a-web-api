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

module.exports = router;
// Write your "projects" router here!
