import express, { Request, Response } from "express";
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.post("/", (req: Request, res: Response) => {
  const { language, field } = req.body; // Destructure the data from body

  res.json({ language, field });
});

app.listen(3001, () => {
  console.log("Server started at port 3001");
});
