import { v4 as uuid } from "uuid";
import { feedbackTypes, TfeedbackTypes } from "../enums";
import { JoinColumn, PrimaryGeneratedColumn, ManyToOne, Entity, PrimaryColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import User from "./userEntity";

@Entity("feedbacks")
export default class Feedback extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;
	@ManyToOne(() => User, (user) => user)
	@JoinColumn({ name: "createdBy" })
	user!: User;

	@Column({ nullable: true, type: "text" })
	description?: string;

	@Column()
	path!: string;

	@Column()
	screenshotUrl!: string;

	@Column({ default: false })
	handled?: boolean;

	@Column({
		type: "enum",
		enum: feedbackTypes.names(),
		default: feedbackTypes.values().BUG,
	})
	type!: TfeedbackTypes;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;
}
