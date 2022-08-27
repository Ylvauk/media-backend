const express = require('express')
const Game = require('../db/models/Game');
const router = express.Router()

router.get('/', (req, res, next) => {
	Game.find({}).then((game) => {
		res.json(game);
	})
    .catch(next)
});

router.get('/:id', (req, res, next) => {
	Game.findById({ _id: req.params.id }).then((game) => {
		if (game) {
            res.json(game);
        } else {
            res.sendStatus(404)
        }
	})
    .catch(next)
});

module.exports = router;