const service = require("./movies.service");

async function movieExists(req, res, next) {
    const movieId = req.params.movieId;
    const foundMovie = await service.read(movieId);

     if (foundMovie) {
         res.locals.movie = foundMovie;
        return next();
    } else {
        res.status(404).json({ error: "Movie cannot be found." });
    }  
}

async function list(req, res) {
    const data = await service.list(req.query.is_showing);
    res.json({ data });
}

async function read(req, res) {
   const movieId = req.params.movieId;
   const data = await service.read(movieId)
   res.json({ data })
}

async function readTheaters(req, res) {
    const movieId = req.params.movieId;
    const data = await service.readTheaters(movieId)
    res.json({ data })
}

async function readReviews(req, res) {
    const movieId = req.params.movieId;
    const data = await service.readReviews(movieId)
    res.json({ data })
}

module.exports = {
    list: list,
    read: [movieExists, read],
    readTheaters: readTheaters,
    readReviews: readReviews,
};