/**
 * Created by yeonjukko on 2016. 2. 14..
 */

var mysql = require('../manager/MysqlConnectionPool');
var flag = require('../manager/ErrorFlag');
var pool = mysql.mysqlPool;


exports.mNewTitle = function (req, res) {
    var email = req.session.user_id;
    var title_name = req.query.title_name;


    pool.getConnection(function (err, db) {

        if (err) {
            db.release();
            res.json(flag.FLAG_ERROR_JSON);
            console.log('false');
            return;
        }

        console.log('connected as id ' + db.threadId);

        //
        db.query('INSERT INTO TITLE_INFO(TITLE_NAME,USER_ID) VALUES(?,?);',
            [title_name,email],
            function (err, rows) {
                if (!err) {
                    db.release();
                    res.json(flag.FLAG_SUCCESS_JSON);

                } else {
                    console.log(err);
                    res.json(flag.FLAG_ERROR_JSON);
                }
            }
        );


    });

}


