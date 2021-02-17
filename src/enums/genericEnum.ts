import _ from "lodash";
import { IGenericEnumClass, IGenericEnum } from "../interfacesAndTypes/enum";

export default class genericEnum<T> implements IGenericEnumClass {
	constructor(private enumObject: IGenericEnum<T>) {}

	values(): IGenericEnum<T> {
		return this.enumObject;
	}
	names(): string[] {
		if (typeof Object.values(this.enumObject)[0] === "object") {
			const names: string[] = Object.values(this.enumObject)
				.map((type: any) => type.name)
				.filter((type) => !_.isEmpty(type));
			return names;
		}
		const names: string[] = (Object.values(this.enumObject) as unknown) as string[];
		return names;
	}
}
