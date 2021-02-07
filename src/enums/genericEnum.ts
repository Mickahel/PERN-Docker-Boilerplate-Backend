import _ from "lodash";
import { genericEnumInterface, enumObjectType } from "../interfacesAndTypes/enum";

export default class genericEnum implements genericEnumInterface {
	constructor(private enumObject: enumObjectType) {}

	values(): enumObjectType {
		return this.enumObject;
	}
	names(): string[] {
		if (typeof Object.values(this.enumObject)[0] === "object" && Object.values(this.enumObject)[0].name) {
			const names: string[] = Object.values(this.enumObject)
				.map((type) => type.name)
				.filter((type: string) => !_.isEmpty(type));
			return names;
		}
		const names: string[] = Object.values(this.enumObject);
		return names;
	}
}
