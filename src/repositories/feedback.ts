import BaseRepository from "./base";
import Feedback from "../models/feedbackEntity";
export default class FeedbackRepository extends BaseRepository<Feedback> {
	constructor() {
		super(Feedback, "feedback");
	}
}
