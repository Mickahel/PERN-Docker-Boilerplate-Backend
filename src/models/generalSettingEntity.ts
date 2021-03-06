import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";

@Entity("generalSettings")
export default class generalSetting extends BaseEntity {
	@PrimaryColumn({ unique: true })
	feature!: string;

	@Column({ type: "text", nullable: true })
	value?: string;
}
