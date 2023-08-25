const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: ["quasar"],
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: true,
    },
  },
  pwa: {
    manifestPath: "./public/manifest.json",
    workboxPluginMode: "GenerateSW",
    runtimeCaching: [
      {
        urlPattern: new RegExp(`^${process.env.VUE_APP_API_URL}`),
        handler: "NetworkFirst",
      },
    ],
  },
});
