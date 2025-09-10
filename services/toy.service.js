import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save,
    getLabelCounts
}

const PAGE_SIZE = 5
const toys = utilService.readJsonFile('data/toys.json')

function query(filterBy = {}) {
    // Create a shallow copy since sort() mutates the original array
    let filteredToys = [...toys]

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredToys = filteredToys.filter(toy => regExp.test(toy.name))
    }
    if (filterBy.inStock) {
        filteredToys = filteredToys.filter(
            toy => toy.inStock === JSON.parse(filterBy.inStock)
        )
    }
    if (filterBy.labels && filterBy.labels.length) {
        filteredToys = filteredToys.filter(
            toy => filterBy.labels.every(label => toy.labels.includes(label))
        )
    }

    const sortBy = filterBy.sortBy || { type: '', sortDir: 1 }
    const sortDirection = +sortBy.sortDir

    if (sortBy.type) {
        filteredToys.sort((toy1, toy2) => {
            if (sortBy.type === 'name') {
                return toy1.name.localeCompare(toy2.name) * sortDirection
            } else if (sortBy.type === 'price' || sortBy.type === 'createdAt') {
                return (toy1[sortBy.type] - toy2[sortBy.type]) * sortDirection
            }
        })
    } else {
        filteredToys.sort((toy1, toy2) => (toy2.createdAt - toy1.createdAt) * sortDirection)
    }

    return Promise.resolve(filteredToys)
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
        toyToUpdate.labels = toy.labels || []
        toyToUpdate.price = toy.price
        toyToUpdate.description = toy.description
        toyToUpdate.ageRange = toy.ageRange
        toyToUpdate.imageUrl = toy.imageUrl
        toyToUpdate.inStock = toy.inStock
        toy = toyToUpdate
    } else {
        toy._id = utilService.makeId()
        toy.owner = loggedinUser
        toy.createdAt = Date.now()
        toy.labels = toy.labels || []
        toys.push(toy)
    }
    toy.updatedAt = new Date().toISOString()
    delete toy.owner.score
    return _saveToysToFile().then(() => toy)
}

function getLabelCounts() {
    return query().then(toys => {
        const labelCountMap = toys.reduce((acc, toy) => {
            toy.labels.forEach(label => {
                acc[label] = (acc[label] || 0) + 1
            })
            return acc
        }, {})

        const labelCountArray = Object.entries(labelCountMap).map(
            ([label, count]) => ({
                label,
                count,
            })
        )
        return labelCountArray
    })
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
