const GeneralRepository = require("../repositories/General")

const paginatedResults = (model, excludeFields, options) => async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit

    try {
        const resultsDB = await GeneralRepository.getPaginatedResults(model, limit, startIndex, excludeFields, options)
        const pages = Math.ceil(resultsDB.length/limit)
        let result = {}

        // ? Check if there is a previous page
        if (startIndex > 0) result.previous = { page: page - 1, limit }

        //? Check if there is a next page
        if (page < pages) result.next = { page: page + 1, limit }

        result.results = resultsDB.result
        result.pages = pages
        result.length = resultsDB.length

        req.paginatedResults = result
        next()
    } catch (e) {
        next({ message: "Error with Pagination" })
    }

}

module.exports = paginatedResults