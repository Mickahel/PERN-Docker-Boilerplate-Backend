import UserRepository from "../repositories/user";
import jwt from "jsonwebtoken";
import { statuses } from "../enums";
import { publicFolder } from "../auxiliaries/server";
import { v4 as uuid } from "uuid";
import sharp from "sharp";
import axios from "axios";
import { UploadedFile } from "express-fileupload";

const UserService = {
	isUserRegistrated: async (email: string): Promise<boolean | object> => {
		if (!email) return false;
		const user = await UserRepository.getUserByEmail(email);
		if (!user) return false;
		// ? the user is registered
		if (user.status === statuses.values().ACTIVE) return { status: 409, message: "User is already registered" };
		else if (user.status === statuses.values().PENDING) return { status: 406, message: "User is not activated" };
		else if (user.status === statuses.values().DISABLED) return { status: 406, message: "User is disabled" };
		return true;
	},

	generateRefreshToken: (id: string): string => {
		return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string);
	},

	generateAccessToken: (id: string): string => {
		return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION} days` });
	},

	uploadProfileImageFromUrl: async (imageUrl: string): Promise<string> => {
		const imageBuffer = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;

		// ? Get image type
		const imageSharp = sharp(imageBuffer);
		const type = await imageSharp.metadata().then(({ format }) => format);
		let filename = uuid() + "." + type;
		imageSharp
			.resize({
				width: 300,
				height: 300,
				fit: sharp.fit.inside,
				withoutEnlargement: true,
			})
			.toFile(publicFolder + "uploads/profileImgs/" + filename, function (err) {
				if (err) throw err;
			});
		return filename;
	},

	uploadProfileImage: (imageObject: UploadedFile): string => {
		// ? Set new image
		let extension = "." + imageObject.name.split(".")[imageObject.name.split(".").length - 1];

		const profileImageUrlName = uuid() + extension;
		if (extension == ".gif") {
			imageObject.mv(publicFolder + "uploads/profileImgs/" + profileImageUrlName, function (err) {
				if (err) throw err;
			});
		} else {
			sharp(imageObject.data)
				.resize({
					width: 300,
					height: 300,
					fit: sharp.fit.inside,
					withoutEnlargement: true,
				})
				.toFile(publicFolder + "uploads/profileImgs/" + profileImageUrlName, function (err) {
					if (err) {
						throw err;
					}
				});
		}
		return "uploads/profileImgs/" + profileImageUrlName;
	},
};

export default UserService;
