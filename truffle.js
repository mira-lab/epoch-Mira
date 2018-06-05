module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    miranet: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      from: "0x009A1A49cDeEB4e9315cCe1d9A0F08E03d74D13f",
    }
  }
};
