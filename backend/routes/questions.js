const express = require('express');
const { QUESTIONS, getContractMetadata } = require('../contract/projectContract');
const { sendSuccess } = require('../utils/apiResponse');

const router = express.Router();

router.get('/', (_req, res) => {
  const contract = getContractMetadata();

  sendSuccess(res, {
    questions: QUESTIONS,
    contract,
    _schema: {
      version: contract.version,
      lastUpdated: contract.lastUpdated,
    },
  });
});

module.exports = router;
