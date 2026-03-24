require("./src/db/config.db");
const express = require("express");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("./src/utils/prestamos.cron");
app.use(express.json());
app.use(cookieParser());


// CORS con credenciales para poder usar cookies HttpOnly desde el frontend
app.use(
  cors({
    origin: true, // refleja el Origin del request
    credentials: true,
  })
);


app.use("/api", require("./src/routes/index.routes"));

app.listen(process.env.PORT || 5000, () => {
  console.log("servidor prendido en el puerto: ", process.env.PORT || 5000);
});
