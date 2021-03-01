function checkIfAwesome(req, res, next) {
    if (req.query.awesome) {
        next();
    } else {
        next('Not Awesome Request.')
    }
}

module.exports = checkIfAwesome