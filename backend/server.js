import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running at ${process.env.BACKEND_URL} at port ${PORT}`,
      );
    });
  })
  .catch((error) => {
    console.error("Some error occured", error);
  });
