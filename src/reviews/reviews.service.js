const knex = require("../db/connection");

function nestCritic(data) {
    const criticData = {
        critic_id: data["critic.critic_id"],
        preferred_name: data["critic.preferred_name"],
        surname: data["critic.surname"],
        organization_name: data["critic.organization_name"],
        created_at: data["critic.created_at"],
        updated_at: data["critic.updated_at"]
    };

    return {
        ...data,
        critic: criticData
    };
}

async function update(updatedReview) {
    await knex("reviews")
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview);

    const updatedRows = await knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", 
                "c.critic_id as critic.critic_id", 
                "c.preferred_name as critic.preferred_name", 
                "c.surname as critic.surname", 
                "c.organization_name as critic.organization_name", 
                "c.created_at as critic.created_at", 
                "c.updated_at as critic.updated_at")
        .where({ "r.review_id": updatedReview.review_id });

    const transformedData = nestCritic(updatedRows[0]);

    return transformedData;
}

function read(reviewId) {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .first();
}

function destroy(reviewId) {
  return knex("reviews")
    .where({ review_id: reviewId })
    .del();
}

module.exports = {
  update,
  read,
  destroy,
};