const webpack = require('webpack');
const path = require('path');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
//const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  /*
   * The entry point
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */
  entry: {
    nodefony: path.resolve(__dirname, "..", "entry.js"),
    /*medias: {
      import: path.resolve(__dirname, "..", 'src', 'medias', "medias.js"),
      library: {
        name: "[name]",
        type: 'umd',
        export: "default",
        umdNamedDefine: true
      },
      //dependOn: 'nodefony'
    },
    socket: {
      import: path.resolve(__dirname, "..", 'src', 'transports', "socket", "socket.js"),
      //dependOn: 'nodefony'
    },
    webaudio: {
      import: path.resolve(__dirname, "..", 'src', 'medias', 'webaudio', "webaudio.js"),
      //dependOn: 'nodefony'
    },
    webrtc: {
      import: path.resolve(__dirname, "..", 'src', 'medias', 'webrtc', "webrtc.js"),
      //dependOn: 'nodefony'
    },
    sip: {
      import: path.resolve(__dirname, "..", 'src', 'protocols', 'sip', "sip.js"),
      //dependOn: 'nodefony'
    }*/
  },
  target: 'web',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "../dist"),
    //publicPath:"nodefony-client/dist/",
    globalObject: 'self',
    library: {
      name: "[name]",
      type: 'umd'
    },
    umdNamedDefine: true,
    libraryExport: "default",
    pathinfo: true,
    //iife: true
  },
  experiments: {
    //outputModule: true,
    //syncWebAssembly: true,
    //topLevelAwait: true,
    //asyncWebAssembly: true,
  },
  optimization: {
    //runtimeChunk: "single",
    /*splitChunks: {
      chunks: "all",
    }*/
  },
  externals: {
    //nodefony: 'nodefony'
  },

  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    /*
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     */
    extensions: ['.js', '.ts','.tsx'],
    // An array of directory names to be resolved to the current directory
    modules: [path.resolve(__dirname, "..", "node_modules")],
    fallback: {
      "events": require.resolve("events"),
      "querystring": require.resolve("querystring-es3"),
      "url": require.resolve("url")
      //"crypto": require.resolve("crypto-browserify"),
      //"buffer": require.resolve("buffer"),
      //"stream": false // require.resolve("stream-browserify")
    }
  },
  /*
   * Options affecting the normal modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    rules: [{
      // BABEL TRANSCODE
      test: new RegExp("\\.js$"),
      exclude: new RegExp("node_modules"),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }]
    }, {
      test: /\.json$/i,
      loader: 'json5-loader',
      type: 'javascript/auto',
    },{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    new CleanWebpackPlugin(),
    //new ManifestPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        "NODE_DEBUG":JSON.stringify(process.env.NODE_DEBUG)
      }
    }),
    new webpack.ProvidePlugin({
      nodefony: 'nodefony'
    }),
  ],
  /*stats: {
    // lets you precisely control what bundle information gets displayed
    //preset: "errors-only",
    // A stats preset
    env: true,
    // include value of --env in the output
    outputPath: true,
    // include absolute output path in the output
    publicPath: true,
    // include public path in the output

    assets: true,
    // show list of assets in output

    entrypoints: true,
    // show entrypoints list
    chunkGroups: true,
    // show named chunk group list


    chunks: true,
    // show list of chunks in output


    modules: true,
    // show list of modules in output

    children: true,
    // show stats for child compilations

    logging: true,
    // show logging in output
    loggingDebug: /webpack/,
    // show debug type logging for some loggers
    loggingTrace: true,
    // show stack traces for warnings and errors in logging output

    warnings: true,
    // show warnings

    errors: true,
    // show errors
    errorDetails: true,
    // show details for errors
    errorStack: true,
    // show internal stack trace for errors
    moduleTrace: true,
    // show module trace for errors
    // (why was causing module referenced)

    builtAt: true,
    // show timestamp in summary
    errorsCount: true,
    // show errors count in summary
    warningsCount: true,
    // show warnings count in summary
    timings: true,
    // show build timing in summary
    version: true,
    // show webpack version in summary
    hash: true,
    // show build hash in summary
  }*/
};
