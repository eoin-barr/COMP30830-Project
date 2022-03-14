require("dotenv/config");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
});

connection.connect(function (err) {
  if (err) {
    console.err("Database connection failed: " + err.stack);
    return;
  }

  console.log("Connected to database 🚴🚴");

  // connection.query(`SELECT * FROM static`, function (err, result) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   if (result) {
  //     console.log(result);
  //   }
  // });
});

connection.end();
