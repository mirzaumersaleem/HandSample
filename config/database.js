const mySql = require('mysql');

const pool = mySql.createPool({
    connectionLimit: 30,
    host: "192.185.82.250",
    user: "myraal_MianRoot",
    password: "raal123@",
    database: "myraal_raal",
    port: "3306",
    connectTimeout: 2000
});
// Recreate the connection, since
// the old one cannot be reused.
// function handleDisconnect() {

//     pool.connect(function (err) {              // The server is either down
//         if (err) {                                     // or restarting (takes a while sometimes).
//             console.log('error when connecting to db:', err);
//             setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//         }                                     // to avoid a hot loop, and to allow our node script to
//     });                                     // process asynchronous requests in the meantime.
//     // If you're also serving http, display a 503 error.
//     pool.on('error', function (err) {
//         console.log('db error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//             handleDisconnect();                         // lost due to either server restart, or a
//         } else {                                      // connnection idle timeout (the wait_timeout
//             throw err;                                  // server variable configures this)
//         }
//     });

// }
// //Providing parameter of user and database to establish connection
// handleDisconnect();
module.exports = pool; 