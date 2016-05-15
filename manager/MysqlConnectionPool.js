/**
 * Created by yeonjukko on 2016. 1. 11..
 */

var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'yeonjukko.net',
    user            : 'yeonjukko',
    password        : 'eldeldeld',
    database        : 'memoend'
});

pool.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0].solution);
});

exports.mysqlPool = pool;