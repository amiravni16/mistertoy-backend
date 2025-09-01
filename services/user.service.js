import fs from 'fs'
import Cryptr from 'cryptr'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    save,
    checkLogin,
    validateToken,
    getLoginToken
}

const users = utilService.readJsonFile('data/user.json')

function query() {
    return Promise.resolve(users)
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    return Promise.resolve(user)
}

function getByUsername(username) {
    const user = users.find(user => user.username === username)
    return Promise.resolve(user)
}

function remove(userId, loggedinUser) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('No Such User')

    if (!loggedinUser.isAdmin) return Promise.reject('Not an admin')
    users.splice(idx, 1)
    return _saveUsersToFile()
}

function save(user, loggedinUser) {
    if (user._id) {
        const userToUpdate = users.find(currUser => currUser._id === user._id)
        if (!loggedinUser.isAdmin && userToUpdate._id !== loggedinUser._id) {
            return Promise.reject('Not your user')
        }
        userToUpdate.fullname = user.fullname
        userToUpdate.score = user.score
        user = userToUpdate
    } else {
        user._id = utilService.makeId()
        user.score = 10000
        users.push(user)
    }
    return _saveUsersToFile().then(() => user)
}

function checkLogin(credentials) {
    const user = users.find(user => user.username === credentials.username)
    if (user && user.password === credentials.password) {
        return Promise.resolve(user)
    }
    return Promise.resolve(null)
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to users file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
