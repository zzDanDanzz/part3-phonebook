
function errorHandler(error, request, response, next) {

    if (error.name === "CastError") {
        return response.status(400).send({error: "invalid id format"})
    }


    next(error)
}

module.exports = errorHandler;