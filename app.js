const hyperdrive = require("hyperdrive");
const express = require("express");

const app = express();
const drive = hyperdrive("./backups");

app.use(express.json({ limit: "2kb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/backups/:key1/:key2", (req, res) => {
  const { key1, key2 } = req.params;
  const path = `/${key1}/${key2}`;
  drive.readFile(path, function (error, data) {
    if (error) {
      res.status(500).json({ error });
      return;
    }
    res.send(data);
  });
});

app.put("/backups/:key1/:key2", (req, res) => {
  const { data } = req.body;
  const { key1, key2 } = req.params;
  const path = `/${key1}/${key2}`;
  drive.writeFile(path, Buffer.from(data), function (error) {
    if (error) {
      res.status(500).json({ error });
      return;
    }
  });
  const stat = "TODO: generate hyperdrive url";
  res.json({ success: true, stat });
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Backup Service running at http://localhost:${port}`)
);
