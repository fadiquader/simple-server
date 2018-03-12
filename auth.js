const express = require('express');
const jwt = require('jsonwebtoken');
const qs = require('qs')
const Mock = require('mockjs')

const router = express.Router();

const SECRET = 'fadi';


const usersListData = Mock.mock({
    'data|80-100': [
        {
            id: '@id',
            name: '@name',
            nickName: '@last',
            phone: /^1[34578]\d{9}$/,
            'age|11-99': 1,
            address: '@county(true)',
            isMale: '@boolean',
            email: '@email',
            createTime: '@datetime',
            avatar: function() {
                return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
            }
        },
    ],
});
const userDatabase = usersListData.data;
const EnumRoleType = {
    ADMIN: 'admin',
    DEFAULT: 'guest',
    DEVELOPER: 'developer',
}

const userPermission = {
    DEFAULT: {
        visit: ['1', '2', '21', '7', '5', '51', '52', '53'],
        role: EnumRoleType.DEFAULT,
    },
    ADMIN: {
        role: EnumRoleType.ADMIN,
    },
    DEVELOPER: {
        role: EnumRoleType.DEVELOPER,
    },
}
const adminUsers = [
    {
        id: 0,
        username: 'admin',
        password: 'admin',
        permissions: userPermission.ADMIN,
    }, {
        id: 1,
        username: 'guest',
        password: 'guest',
        permissions: userPermission.DEFAULT,
    }, {
        id: 2,
        username: '吴彦祖',
        password: '123456',
        permissions: userPermission.DEVELOPER,
    },
]

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.sign({ sub: user.id, iat: timestamp }, SECRET, {
        expiresIn: '7d'
    });
}

function verify(token) {
    try {
        const t = jwt.verify(token, SECRET);
        if(t === null) return false
        return t
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
// router.get('/user', function (req, res) {
//     const id = req.params.id;
//     res.status(200).json({
//         success: true,
//         user: {
//             id: id,
//             username: 'fadiqua'
//         }
//     })
// });

router.post('/user/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    var user = null;
    for(var idx=0; idx < adminUsers.length; idx++) {
        if(adminUsers[idx].username === username) {
            user = adminUsers[idx];
        }
    }
    if (user) {
        const token = tokenForUser(user);
        res.json({
            success: true,
            message: 'Ok',
            user: user,
            token: token
        })
    } else {
        res.status(400).end()
    }
});

router.get('/user', function (req, res) {
    const token = req.headers.authorization || null;
    // console.log('token: ', token)
    const decodedToken = verify(token);

    const response = {}
    if (!token) {
        res.status(200).send({ message: 'Not Login' })
        return;
    }
    if (token) {
        response.success = decodedToken ? true : false
    }
    var userItem = null;
    if (response.success) {
        for(var idx = 0; idx < adminUsers.length ; idx++) {
            if(adminUsers[idx].id === decodedToken.sub) {
                userItem = adminUsers[idx]
                break;
            }
        }
    }
    response.user = userItem
    res.json(response)
})
module.exports = router;