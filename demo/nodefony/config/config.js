/**
 *  NODEFONY FRAMEWORK
 *
 *       KERNEL CONFIG
 *
 *   Domain listen : Nodefony can listen only one domain ( no vhost )
 *     Example :
 *      domain :  0.0.0.0      // for all interfaces
 *      domain :  [::1]        // for IPV6 only
 *      domain :  192.168.1.1  // IPV4
 *      domain :  mydomain.com // DNS
 *
 *   Domain Alias : string only "<<regexp>>" use domainCheck : true
 *     Example :
 *      domainAlias:[
 *        "^127.0.0.1$",
 *        "^localhost$",
 *        ".*\\.demo\\.com",
 *        "^demo\\.eu$",
 *        "^.*\\.demo\\.eu$"
 *      ]
 */
const path = require("path");
let certificats = {
  options: {
    rejectUnauthorized: true
  }
};
let CDN = null;
let statics = true;
let monitoring = true;
let documentation = true;
let unitTest = true;
let domainCheck = false;
if (process.env && process.env.NODE_ENV === "production") {
  certificats.key = path.resolve("config", "certificates", "server", "privkey.pem");
  //certificats.key = path.resolve("docker", "asterisk", "conf","keys", "asterisk.key");
  //certificats.cert = path.resolve("docker", "asterisk", "conf","keys", "asterisk.crt");
  //certificats.ca = path.resolve("docker", "asterisk", "conf","keys", "ca.crt");
  certificats.cert = path.resolve("config", "certificates", "server", "fullchain.pem");
  certificats.ca = path.resolve("config", "certificates", "ca", "demo-root-ca.crt.pem");
  CDN = null;
  statics = true;
  documentation = false;
  monitoring = true;
  unitTest = false;
  domainCheck = true;
} else {
  //certificats.key = path.resolve("docker", "asterisk", "conf","keys", "asterisk.key");
  //certificats.cert = path.resolve("docker", "asterisk", "conf","keys", "asterisk.crt");
  //certificats.ca = path.resolve("docker", "asterisk", "conf","keys", "ca.crt");
  certificats.key = path.resolve("config", "certificates", "server", "privkey.pem");
  certificats.cert = path.resolve("config", "certificates", "server", "fullchain.pem");
  certificats.ca = path.resolve("config", "certificates", "ca", "demo-root-ca.crt.pem");
}

module.exports = {
  system: {
    domain: "0.0.0.0",
    domainAlias: [
      "^127.0.0.1$",
      "^localhost$"
    ],
    httpPort: 5151,
    httpsPort: 5152,
    domainCheck: domainCheck,
    locale: "en_en",

    /**
     * BUNDLES CORE
     */
    security: true,
    realtime: true,
    monitoring: monitoring,
    mail: true,
    documentation: documentation,
    unitTest: unitTest,
    redis: false,
    mongo: false,
    elastic: false,

    /**
     * SERVERS
     */
    servers: {
      statics: statics,
      protocol: "2.0", //  2.0 || 1.1
      http: true,
      https: true,
      ws: true,
      wss: true,
      certificats: certificats
    },

    /**
     * DEV SERVER
     */
    devServer: {
      inline: true,
      hot: false,
      hotOnly: false,
      overlay: true,
      logLevel: "info", // none, error, warning or info
      progress: false,
      protocol: "https",
      websocket: true
    },

    /**
     *  BUNDLES LOCAL REGISTRATION
     *    Examples :
     *       bundles:{
     *         "hello-bundle" : "file:src/bundles/hello-bundle",
     *         "hello-bundle" : path.resolve("src", "bundles", "hello-bundle")
     *         "hello-bundle" : path.resolve(__dirname, "..", "src", "bundles", "hello-bundle"),
     *       }
     */
    bundles: {
      "users-bundle": path.resolve("src", "bundles", "users-bundle")
    },
    /**
     * SYSLOG NODEFONY
     */
    log: {
      active: true,
      debug: "*" // []
    }
  },

  /**
   *       ASSETS CDN
   *
   *       You set cdn with string
   *       CDN :    "cdn.demo.com",
   *       or
   *       CDN:
   *          global: "cdn.demo.com",
   *       or
   *       CDN:{
   *         stylesheet:[
   *           "cdn.demo.com"
   *         ],
   *         javascript:[
   *           "cdn.demo.com"
   *         ],
   *         image:[
   *           "cdn.demo.com",
   *           "cdn.demo.fr"
   *         ],
   *         font:[
   *           "cdn.demo.com"
   *         ]
   *      },
   */
  CDN: CDN,

  /**
   *  ENGINE TEMPLATE
   *
   *       TWIG
   *       https://github.com/justjohn/twig.js
   *
   */
  templating: "twig",

  /**
   * ENGINE ORM
   *       sequelize || mongoose
   *   orm : mongoose
   */
  orm: "sequelize",

  /**
   * NODE.JS PACKAGE MANAGER
   *
   *       npm
   *       yarn
   */
  packageManager: "npm"

};
