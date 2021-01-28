const { database } = require("../models/index");

class BaseRepository {


  constructor(repository) {
    this._repository = repository;
  }

  getRepository() {
    return this._repository;
  }

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


  getTablesSize() {
    return database.query("SELECT table_name, pg_size_pretty(pg_total_relation_size(quote_ident(table_name))), pg_total_relation_size(quote_ident(table_name)) FROM  information_schema.tables WHERE table_schema = \'public\' ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC")
  }
}

module.exports = BaseRepository;
