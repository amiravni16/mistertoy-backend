import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 5
const toys = utilService.readJsonFile('data/toys.json')

function query(filterBy = { txt: '' }) {
    const regex = new RegExp(filterBy.txt, 'i')
    var toysToReturn = toys.filter(toy => regex.test(toy.name))

    if (filterBy.minPrice) {
        toysToReturn = toysToReturn.filter(toy => toy.price >= filterBy.minPrice)
    }
    if (filterBy.maxPrice) {
        toysToReturn = toysToReturn.filter(toy => toy.price <= filterBy.maxPrice)
    }
    if (filterBy.category) {
        toysToReturn = toysToReturn.filter(toy => 
            toy.category.toLowerCase() === filterBy.category.toLowerCase()
        )
    }
    if (filterBy.inStock !== undefined) {
        toysToReturn = toysToReturn.filter(toy => toy.inStock === filterBy.inStock)
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        toysToReturn = toysToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return Promise.resolve(toysToReturn)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId, loggedinUser) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')

    const toy = toys[idx]
    if (!loggedinUser.isAdmin &&
        toy.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your toy')
    }
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy, loggedinUser) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        if (!loggedinUser.isAdmin &&
            toyToUpdate.owner._id !== loggedinUser._id) {
            return Promise.reject('Not your toy')
        }
        toyToUpdate.name = toy.name
        toyToUpdate.category = toy.category
        toyToUpdate.price = toy.price
        toyToUpdate.description = toy.description
        toyToUpdate.ageRange = toy.ageRange
        toyToUpdate.imageUrl = toy.imageUrl
        toyToUpdate.inStock = toy.inStock
        toy = toyToUpdate
    } else {
        toy._id = utilService.makeId()
        toy.owner = loggedinUser
        toy.createdAt = new Date().toISOString()
        toys.push(toy)
    }
    toy.updatedAt = new Date().toISOString()
    delete toy.owner.score
    return _saveToysToFile().then(() => toy)
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toys.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
