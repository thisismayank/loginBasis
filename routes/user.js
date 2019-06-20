'use strict';

const express = require('express');
const app = express();
const router = express.Router();

// cors
const cors = require('cors');

// utils
const authUtils = require('../utils/122-auth-utils');
const emailUtils = require('../utils/133-email-utils');

// jwt
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';

// to handle cross-origin-requests
router.use(cors());
