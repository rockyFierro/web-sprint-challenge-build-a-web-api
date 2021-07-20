const express = require('express');
const Actions = require('./actions-model');
const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const actions = await Actions.get();
      if (!actions) {
        console.log('actions are not available.');
        res.json([]);
      } else {
        res.json(actions);
      }
    } catch (error) {
      res.status(500).json({
        message: 'unable to return actions',
        stack: error.stack,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const { project_id, description, notes } = req.body;
      if (!project_id || !description || !notes) {
        res.status(400).json({
          message: "missing a parameter; please check that you have provided a 'project_id', 'description', and 'notes'; please use the same spelling as given here."
        });
      } else {
        const newAction = await Actions.insert(req.body);
        res.json(newAction);
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
        const action = await Actions.get(req.params.id);
        if (!action) {
          console.log('nothing there...');
          res.status(404).json({
            message: "please provide a proper action id"
          });
        } else {
          console.log(action);
          res.json(action);
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
        const action = await Actions.get(req.params.id);
        if (!action) {
          res.status(404).json({
            message: 'unable to retrieve that id, are you sure it exists?',
          });
        } else {
          const { description, notes, project_id } = req.body;
          if (!description || !notes || !project_id) {
            res.status(400).json({
              message: `It looks like there is a missing field. please check that you are providing  
              "notes", "description", and "project_id" as they are dispalyed here.`
            });
          } else {
            const updated = await Actions.update(req.params.id, req.body);
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
        const id = await Actions.get(req.params.id);
        if(!id){
          res.status(404).json({
            message: ' there is no action to delete with that id.',
          });
        } else {
          const deleted = await Actions.remove(req.params.id);
          res.status(200).json(deleted);
        }
      } catch (error) {
        res.status(500).json({
          message: ' unable to complete this request',
        });
      }
    }
    //returns no response body
    //if there is no action with the given id it responds with a status code 404
  );

module.exports = router;
// Write your "actions" router here!
