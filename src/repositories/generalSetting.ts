import _ from "lodash";
import { getRepository, In } from "typeorm";
import BaseRepository from "./base";
import GeneralSetting from "../models/generalSettingEntity";

export default class GeneralSettingRepository extends BaseRepository<GeneralSetting> {
	constructor() {
		super(GeneralSetting, "generalSetting");
	}
}
