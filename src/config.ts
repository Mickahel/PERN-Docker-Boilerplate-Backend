const configuration = {
	base: {
		longTitle: "PERN Boilerplate",
		shortTitle: "PERNB",
		description: "A PERN Boilerplate",
		apiDocsLink: "/api-docs",
		mainDomain: "https://app.pernboilerplate.it",
		notificationColor: "#86DAF1",
		contact: {
			name: "Michelangelo De Francesco",
			url: "https://www.linkedin.com/in/michelangelodefrancesco",
			email: "df.michelangelo@gmail.com",
		},
	},
	production: {},
	development: {},
};

const config = {
	...(process.env.NODE_ENV === "production" ? configuration.production : configuration.development),
	...configuration.base,
};

export default config;
