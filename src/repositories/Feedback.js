const { database } = require("../models");
const _ = require("lodash");

class FeedbackRepository {
    getAll() {
        return database.models.feedback.findAll();
    }

    async createFeedback(feedback) {
        return await database.models.feedback.create(feedback);
    }

    getFeedbackById(id) {
        return database.models.feedback.findOne({
            where: {
                id,
            },
        });
    }

    async updateFeedback(feedback, newFeedback) {
        await feedback.update(newFeedback);
    }

    deleteFeedback(id) {
        return database.models.feedback.destroy({
            where: {
                id
            },
        });
    }
}

module.exports = new FeedbackRepository();
