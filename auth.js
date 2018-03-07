const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const SECRET = 'fadi';

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.sign({ sub: user.username, iat: timestamp }, SECRET, {
        expiresIn: '7d'
    });
}

function verify(token) {
    try {
        const t = jwt.verify(token, SECRET);
        if(t === null) return false
        return true
    } catch (err) {
        return false
    }
}

router.get('/me', function (req, res) {
    const token = req.headers['x-token'];
    const isValid = verify(token);
    if(!isValid) {
        res.status(403).json({ jwt: 'expired'})
    }
    else {
        console.log('token ', token)
        res.status(200).json({
            success: true,
            token: token,
            me: {
                id: 1,
                username: 'fadiqua'
            }
        })
    }

});
router.get('/user/:id', function (req, res) {
    const id = req.params.id;
    res.status(200).json({
        success: true,
        user: {
            id: id,
            username: 'fadiqua'
        }
    })
});

router.post('/login', function (req, res) {
    const username = req.body.username;
    const token = tokenForUser({ username: username })
    res.status(200).json({
        success: true,
        token: token,
        user: {
            id: 1,
            username: username,
            email: 'fadi@gmail.com'
        }
    })
});

module.exports = router;