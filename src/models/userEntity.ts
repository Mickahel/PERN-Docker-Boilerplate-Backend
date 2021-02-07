import { randomBytes, pbkdf2Sync } from "crypto";
import { v4 as uuid } from "uuid";

import { statuses, Tstatuses, Tthemes, themes, roles, Troles } from "../enums";
import { Generated, PrimaryGeneratedColumn, OneToMany, Entity, PrimaryColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PushNotificationUserToken } from "./pushNotificationUserTokenEntity";
import { Feedback } from "./feedbackEntity";

@Entity("users")
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	@Generated("uuid")
	activationCode?: string;

	@OneToMany(() => Feedback, (feedback) => feedback.user)
	feedbacks?: Feedback[];

	@OneToMany(() => PushNotificationUserToken, (pushNotificationUserToken) => pushNotificationUserToken.user)
	pushNotificationUserTokens?: PushNotificationUserToken[];

	@Column({ unique: true })
	email!: string;

	@Column()
	salt!: string;

	@Column()
	hash!: string;

	@Column({ nullable: true })
	firstname?: string;

	@Column({ nullable: true })
	lastname?: string;

	@Column({ nullable: true })
	profileImageUrl?: string;

	@Column({ nullable: true })
	facebookId?: string;

	@Column({ nullable: true })
	googleId?: string;

	@Column({ nullable: true })
	refreshToken?: string;

	@Column({
		type: "enum",
		enum: statuses.names(),
		default: statuses.values().PENDING,
	})
	status!: Tstatuses;

	@Column({
		default: "en-EN",
	})
	language!: string;

	@Column({
		type: "enum",
		enum: themes.names(),
		default: themes.values().LIGHT,
	})
	theme!: Tthemes;

	@Column({
		type: "enum",
		enum: roles.names(),
		default: roles.getRoleWithMinimumPermissionLevelByUserType(false).name,
	})
	role!: Troles;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	setRefreshToken(refreshToken: string): void {
		this.refreshToken = refreshToken;
	}

	setPassword(password: string): void {
		this.salt = randomBytes(16).toString("hex");
		this.hash = pbkdf2Sync(password, this.salt, 10, 64, "sha512").toString("hex");
	}

	setActivationCode(): void {
		this.activationCode = uuid();
	}

	validatePassword(password: string): boolean {
		const hash = pbkdf2Sync(password, this.salt, 10, 64, "sha512").toString("hex");
		return this.hash === hash;
	}

	createPassword(): string {
		const password = uuid().substring(0, 7).replace("-", "");
		this.setPassword(password);
		return password;
	}
}
