//declare global {
namespace Express {
	interface Request {
		user: import("../../src/models/userEntity").default;
		paginatedResults?: import("../../src/interfacesAndTypes/pagination").default;
	}
}
//}
