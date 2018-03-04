const { Router } = require('express');
const { Event, sequelize } = require('../db/db');
const log = require('../utils/log');

const router = Router();
const { ValidationError } = sequelize;

const extractBodyVariables = ({
  name, begin_date, end_date,
  venue, latitude, longitude,
}) => ({
  name,
  begin_date,
  end_date,
  venue,
  latitude,
  longitude,
});

router.get('/', async (req, res) => {
  try {
    const timer = log.startTimer();
    const models = await Event.findAll();
    timer.done(`Found ${models.length} events`);
    res.send(models);
  } catch (error) {
    log.error('There was an error trying to get all models');
    log.error(error.stack);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const model = await Event.findById(id);
    if (model) {
      log.debug(`Found event model with id: ${id}. Sending data from model`);
      res.send(model);
    } else {
      log.debug(`Event model with id ${id} not found. Sending 400 status`);
      res.sendStatus(400);
    }
  } catch (error) {
    log.error(`There was an error trying to find the event model with id ${id}`);
    log.error(error.stack);
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  let model;
  try {
    model = await Event.findById(id);
  } catch (error) {
    log.error(`There was an error finding an event with the id ${id}`);
    log.error(error.stack);
    res.sendStatus(500);
  }
  if (model) {
    log.debug(`Event with id ${id} found. Trying to delete`);
    try {
      await model.destroy();
      log.debug(`Event with id ${id} is now gone`);
      res.send({ id, deleted: true });
    } catch (error) {
      log.error(`There was an error removing the event with the id ${id}`);
      log.error(error.stack);
      res.status(500).send({ id, deleted: false });
    }
  } else {
    log.debug(`Event with id ${id} not found. No models deleted`);
    res.sendStatus(400);
  }
});

router.post('/', async (req, res) => {
  let model;
  try {
    log.debug('Creating new event');
    model = await Event.create(extractBodyVariables(req.body));
    log.debug(`Event created with id ${model.id}`);
    res.send(model);
  } catch (error) {
    log.error('There was an error saving the model with the values', req.body);
    log.error(error.stack);
    if (error instanceof ValidationError) {
      log.debug('Error is instance of ValidationError');
      res.status(422).send(error.errors);
    } else {
      res.sendStatus(500);
    }
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.body;
  let model;
  try {
    log.debug(`Trying to get event model with id ${id}`);
    model = await Event.findById(id);
  } catch (error) {
    log.error(`There was an error finding an event with the id ${id}`);
    log.error(error.stack);
    res.sendStatus(500);
  }
  if (model) {
    log.debug(`Event with id ${id} found, trying to edit`);
    try {
      await model.update(extractBodyVariables(req.body));
      res.send(model);
    } catch (error) {
      log.error(`There was an error editing the event ${id}`);
      log.error(error.stack);
      log.debug('The following body was used', req.body);
      res.sendStatus(500);
    }
  } else {
    log.debug(`Event with id ${id} was not found. No model will be edited`);
    res.sendStatus(400);
  }
});

module.exports = router;
