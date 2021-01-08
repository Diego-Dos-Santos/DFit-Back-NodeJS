const router = require('express').Router();
const trainers = require('../data/trainers');
const clients = require('../data/clients');

router.get('/', (req, res) => {
  res.status(200).json({
    trainers: trainers(),
    ...clients,
  });
});

module.exports = router;
