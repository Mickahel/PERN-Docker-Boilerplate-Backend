import { getManager, FindConditions, BaseEntity, UpdateResult, getRepository, DeleteResult, DeepPartial, FindOneOptions, FindManyOptions } from "typeorm";
import _ from "lodash";
import { v4 as uuid } from "uuid";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
/// https://stackoverflow.com/questions/40820195/creating-generic-repository-using-typeorm
export type ObjectType<T> = { new (): T } | Function;

export default class BaseRepository<Entity extends BaseEntity> {
	//private _entityManager : EntityManager | undefined;
	protected _type: ObjectType<Entity>;
	private _table: string;

	constructor(type: ObjectType<Entity>, table: string) {
		this._type = type;
		this._table = table;
	}

	async duplicate(entity: string | Entity | undefined, maySave: boolean = true): Promise<Entity> {
		try {
			if (typeof entity === "string") entity = await this.getById(entity);
			if (!entity) throw "Entity not Found";
			_.set(entity, "id", uuid());

			if (maySave) return await entity.save();
			else return entity;
		} catch (e) {
			throw e;
		}
	}

	getAll(options: FindManyOptions<Entity> = {}): Promise<Entity[]> {
		return getRepository(this._type).find(options);
	}

	getById(id: string, options: FindOneOptions<Entity> = {}): Promise<Entity | undefined> {
		return getRepository(this._type).findOne(id, {
			loadRelationIds: false,
			...options,
		});
	}

	getBy(options: FindOneOptions<Entity> = {}): Promise<Entity | undefined> {
		return getRepository(this._type).findOne({
			loadRelationIds: false,
			...options,
		});
	}

	create(data: DeepPartial<Entity>): Promise<Entity> {
		return getRepository(this._type).create(data).save();
	}

	update(id: string, data: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
		return getRepository(this._type).update(id, data);
	}

	getFields(ids: string[]) {
		let out = "";
		for (let i = 0; i < ids.length; i++) {
			out += ",?";
		}
		return out.substr(1);
	}

	getGeneric(where: FindConditions<Entity>): Promise<Entity | undefined> {
		return getRepository(this._type).findOne({ where });
	}
	genericChangeBoolean(id: string | string[], value: boolean, field: string = "status"): Promise<any> {
		if (!Array.isArray(id)) id = [id];
		return getManager().query(`UPDATE ${this._table} SET ${field} = ${value} WHERE id IN (${this.getFields(id)})`, id);
	}

	genericChangeString(id: string | string[], value: string, field: string = "status"): Promise<any> {
		if (!Array.isArray(id)) id = [id];

		return getManager().query(`UPDATE ${this._table} SET ${field} = (?) WHERE id IN (${this.getFields(id)})`, [value, ...id]);
	}

	deleteLogical(entity: string | string[] | Entity): Promise<any> {
		let finalIds = [];
		if (entity instanceof BaseEntity) finalIds = [_.get(entity, "id")];
		// Grande pezza
		else if (!Array.isArray(entity)) finalIds = [entity];
		else finalIds = entity;

		return getRepository(this._type).query(`UPDATE ${this._table} SET status = "DELETED" WHERE id IN (${this.getFields(finalIds)})`, finalIds);
	}

	deletePhysical(entity: string | string[] | Entity | Entity[]): Promise<DeleteResult | Entity | Entity[] | undefined> {
		let finalIds: string[] = [];
		if (Array.isArray(entity)) {
			if (entity.length === 0) return Promise.resolve(undefined);
			let zero = entity[0];
			if (zero instanceof BaseEntity) return getRepository(this._type).remove(entity as Entity[]);
			else return getRepository(this._type).delete(entity as string[]);
		} else {
			if (entity instanceof BaseEntity) return getRepository(this._type).remove(entity as Entity);
			else return getRepository(this._type).delete(entity as string);
		}
	}

	// TODO NEEDS REFACTOR
	/*
	async getPaginatedResults(limit, offset, excludeFields, options) {
		let result = await this.repository.findAll({
			...options,
			attributes: {
				exclude: excludeFields,
				...options?.attributes,
			},
			offset,
			limit,
			raw: true,
		});

		let entitiesInModel = await this.repository.findAndCountAll({
			...options,
			attributes: {
				exclude: excludeFields,
				...options?.attributes,
			},
		});

		return {
			result,
			length: entitiesInModel.count,
		};
	}
*/
}