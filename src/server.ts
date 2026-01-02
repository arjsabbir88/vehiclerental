import app from "./app";
import config from "./config";

const port = config.port;


// this is express server 
app.listen(port, () => {
  console.log(`vehiclerental project runing on port ${port}`);
});
