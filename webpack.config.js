const fs = require('fs');
const StringReplacePlugin = require("string-replace-webpack-plugin");

module.exports = {
    mode:'development',
    module: {
        loaders: [
           // configure replacements for file patterns
           { 
              test: 'src/environments/environment.ts',
              loader: StringReplacePlugin.replace({
                  replacements: [
                      {
                          pattern: /@secret (\w*?)/ig,
                          replacement: function (match, p1, offset, string) {
                              return secrets.web[p1];
                          }
                      }
                  ]})
              }
        ]
     },
     plugins: [
        // an instance of the plugin must be present
        new StringReplacePlugin()
     ]
};