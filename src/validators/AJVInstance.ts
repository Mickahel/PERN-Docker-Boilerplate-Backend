import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv({
	coerceTypes: true,
	allowUnionTypes: true,
});
addFormats(ajv);
export default ajv;
