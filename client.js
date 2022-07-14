const http = require("http");
const client = (method = "GET", url = "", headers) => {
  return new Promise((resolve) => {
    let idx = url.indexOf("/");
    let hostname = url;
    let path = "/";
    let port;

    if (idx !== -1) {
      hostname = url.slice(0, url.indexOf("/"));
      url.slice(url.indexOf("/"));
    }

    idx = url.indexOf(":");

    if (idx !== -1 && url.slice(url.indexOf(":") + 1).length >= 4) {
      hostname = url.slice(0, url.indexOf(":"));
      port = +url.slice(idx + 1, idx + 5);
    }

    let data = [];
    http
      .request(
        {
          method,
          hostname,
          port,
          path,
          headers,
        },
        (res) => {
          res.on("data", (c) => data.push(c));
          res.on("end", () => {
            try {
              resolve(JSON.parse(Buffer.concat(data).toString()));
            } catch (e) {
              resolve(Buffer.concat(data).toString());
            }
          });
        }
      )
      .end();
  });
};
const log = (level, log, time = new Date()) => {
  return console.log(JSON.stringify({ level, log, time }));
};

((server = process.env.DYNAMIC_IP_SERVER) => {
  log("start", `Server is [${server}]`);
  setInterval(async () => {
    try {
      const ip = await client("GET", "ifconfig.me");
      const result = await client("POST", server, {
        "x-request": `{"aXBhZGRy": "${ip}"}`,
      });
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }, 300000);
})();
