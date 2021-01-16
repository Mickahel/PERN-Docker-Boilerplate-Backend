const { database } = require("../models");
const _ = require("lodash");

class FeedbackRepository {
    getAll() {
        return database.models.feedback.findAll(
            
            { include: database.models.user}
            );
    }

    createFeedback(feedback) {
        return database.models.feedback.create(feedback);
    }

    getFeedbackById(id) {
        return database.models.feedback.findOne({
            where: {
                id,
            },
        });
    }

    editFeedback(feedback, newFeedback) {
        return feedback.update(newFeedback);
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
