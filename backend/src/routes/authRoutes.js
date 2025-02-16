const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Registro de usuário
router.post('/register', register);

// Login de usuário
router.post('/login', login);

module.exports = router;

