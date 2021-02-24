module.exports = (role) => (req, res, next) => {
    if(req.decodedToken.role ===role) {
        next()
    } else {
        res.status(403).json("You are not authorized, admin role required.")
    }
}