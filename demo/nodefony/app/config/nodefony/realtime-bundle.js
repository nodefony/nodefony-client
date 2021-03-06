/**
 *  OVERRIDE BUNDLE REALTIME
 *
 *       see REALTIME BUNDLE config for more options
 *       monitoring service realtime
 */
module.exports = {
  services: {
    monitoring: {
      type: "tcp",
      port: 1318,
      domain: "0.0.0.0"
    },
    sip: {
      //domain: "pbx.example.com",
      domain: "127.0.0.1",
      type: "udp",
      port: 5062,
      options:{}
    },
    /*sip:{
      type: "tcp",
      //domain: "pbx.example.com",
      domain: "127.0.0.1",
      port: 5060,
      options:{
        allowHalfOpen: true,
        highWaterMark: 1024 * 64
      }
    }*/
  }
};
