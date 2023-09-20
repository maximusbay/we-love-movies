const knex = require("../db/connection");
const lodash = require("lodash");

function addCritic(data) {
  if (data) {
    let formattedData;

    if (Array.isArray(data)) {
      formattedData = data.map((review) => {
        return Object.entries(review).reduce((accumulator, [key, value]) => {
          return lodash.set(accumulator, key, value);
        }, {});
      });
    } else {
      formattedData = Object.entries(data).reduce((accumulator, [key, value]) => {
        return lodash.set(accumulator, key, value);
      }, {});
    }

    return formattedData;
  }

  return data;
}

function list(isShowing) {
    if (isShowing === "true") {
      return listShowing();
    }
    return listEvery();
}
  
  function listEvery() {
    return knex("movies").select("*");
}
  
function listShowing() {
    return knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .select("m.movie_id", 
              "m.title", 
              "m.runtime_in_minutes", 
              "rating", "description", 
              "image_url"
              )
      .groupBy("m.movie_id")
      .where({ is_showing: true });
}

function read(movieId) {
    return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function readTheaters(movieId) {
    return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("*")
    .where({ "mt.movie_id": movieId })
}

function readReviews(movieId) {
  return knex("reviews as r" )
  .join("critics as c", "r.critic_id", "c.critic_id")
  .select(
      "r.*",
      "c.critic_id as critic.critic_id",
      "c.preferred_name as critic.preferred_name",
      "c.surname as critic.surname",
      "c.organization_name as critic.organization_name"
    )
  .where({ "r.movie_id": movieId })
  .then(addCritic)
}

module.exports = {
    list,
    read,
    readTheaters,
    readReviews,
};
