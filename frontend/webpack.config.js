const fs = require("fs");
const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");

class CopyPublicAssetsPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("CopyPublicAssetsPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "CopyPublicAssetsPlugin",
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          const assetPath = path.join(__dirname, "public", "helmet-reference.jpeg");
          compilation.emitAsset("helmet-reference.jpeg", new compiler.webpack.sources.RawSource(fs.readFileSync(assetPath)));
        },
      );
    });
  }
}

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json", ".mjs", ".wasm"],
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true,
  },
};
