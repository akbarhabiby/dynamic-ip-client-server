const http = require("http");
const response = (res, status = 404, data = {}) => {
  res.writeHead(200);
  res.end(JSON.stringify({ status, data }));
};
const log = (level, log, time = new Date()) => {
  return console.log(JSON.stringify({ level, log, time }));
};

((port = 8888, ip = "") => {
  http
    .createServer((req, res) => {
      res.setHeader("Content-Type", "application/json");
      switch (req.method) {
        case "GET":
          response(res, 200, { ip });
          break;
        case "POST":
          try {
            ip = JSON.parse(req.headers["x-request"] || "{}")["aXBhZGRy"];
          } catch (e) {}
          response(res, 201, { ip });
          break;
        default:
          response(res);
      }
    })
    .listen(port, () => log("start", "Server started on :" + port));
})();
