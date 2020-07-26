const path = require("path");

module.exports = {
	mode: "development",
	entry: "./src/index.ts",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				include: [ path.resolve(__dirname, "src") ]
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	output: {
		publicPath: "public",
		filename: "bundle.js",
		path: path.join(__dirname, "public")
	}
};