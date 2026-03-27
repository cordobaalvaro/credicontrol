const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("bufferTimeoutMS", 2147483647);
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_ACCESS, {
    serverSelectionTimeoutMS: 86400000,
    connectTimeoutMS: 86400000,
    socketTimeoutMS: 0,
  })
  .then(() => console.log("MongoDB conectado correctamente"))
  .catch((error) => {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  });
