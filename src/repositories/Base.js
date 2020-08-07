class BaseRepository {

    constructor(repository){
        this._repository = repository
    }

    getRepository(){
        return this._repository;
    }

    getAll(){
        return this._repository.getAll();
    }

    getById(id){
        return this._repository.getById(id);
    }
    
    async getPaginatedResults(limit, offset, excludeFields, options) {
        let result = await this.repository.findAll({
            ...options,
            attributes: {
                exclude: excludeFields,
                ...options?.attributes
            },
            offset,
            limit,
            raw: true
        })

        let entitiesInModel = await this.repository.findAndCountAll({
            ...options,
            attributes: {
                exclude: excludeFields,
                ...options?.attributes
            },
        })

        return {
            result,
            length: entitiesInModel.count
        }

    }
}

module.exports = BaseRepository