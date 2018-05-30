module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    miranet: {
      host: "94.130.94.162",
      port: 8545,
      network_id: "*",
      from: "0x7125B514c135a89a8776a4336C20b4bb183Fb97D",
    }
  }
};
