const { loginUser, registerUser, profileData,addConnection, removeConnection, getAllUser, getUser } = require('../Controllers/UserController');
const express = require('express');
const requireAuth = require('../Middleware/Auth');
const router = express.Router();

// Middleware


router.post('/register', registerUser)
router.post('/login', loginUser)

router.use(requireAuth);
router.get('/profile', profileData)
router.post('/:id/addConnection', addConnection)
router.post('/:id/removeConnection', removeConnection)
router.get('/explore', getAllUser)
router.get('/:id', getUser)



module.exports = router;