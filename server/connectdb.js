const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL);
    console.log(con.connection.host);
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectdb;
