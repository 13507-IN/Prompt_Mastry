const express = require('express');
const { QUESTIONS, getContractMetadata } = require('../contract/projectContract');
const { sendSuccess } = require('../utils/apiResponse');

const router = express.Router();

router.get('/', (_req, res) => {
  sendSuccess(res, {
    questions: QUESTIONS,
    contract: getContractMetadata(),
  });
});

module.exports = router;
