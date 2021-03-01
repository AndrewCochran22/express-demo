function radLogger(req, res, next) {
    console.log("SWEET REQUEST BRO!: ", req.url)
    next()
}

module.exports = radLogger