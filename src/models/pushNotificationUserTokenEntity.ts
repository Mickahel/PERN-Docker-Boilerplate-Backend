import { ManyToOne, Entity, PrimaryColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./userEntity";

@Entity("pushNotificationUserTokens")
export class PushNotificationUserToken extends BaseEntity {
	@PrimaryColumn()
	token!: string;

	@ManyToOne(() => User, (user) => user.id)
	user!: User;
}
