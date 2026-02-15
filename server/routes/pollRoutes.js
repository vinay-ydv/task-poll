const router = require("express").Router();
const ctrl = require("../controllers/pollController.js");

router.post("/", ctrl.createPoll);
router.get("/:id", ctrl.getPoll);
router.post("/:id/vote", ctrl.votePoll);

module.exports = router;
