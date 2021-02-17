import { getConnection } from "typeorm";

export default class DatabaseRepository {
	getTablesSizes() {
		return getConnection().query(
			"SELECT table_name, pg_size_pretty(pg_total_relation_size(quote_ident(table_name))), pg_total_relation_size(quote_ident(table_name)) FROM  information_schema.tables WHERE table_schema = 'public' ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC"
		);
	}
}
