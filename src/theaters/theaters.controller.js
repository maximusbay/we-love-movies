const service = require("./theaters.service");

async function list(req, res) {
    const theaterList = await service.list()

    for (let theater of theaterList) {
      const addMovies = await service.listMovies(theater.theater_id)
      theater["movies"] = addMovies
    }
  
    res.json({ data: theaterList });
}

module.exports = {
    list
}