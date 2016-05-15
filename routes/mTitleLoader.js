/**
 * Created by yeonjukko on 2016. 1. 28..
 */

var mysql = require('../manager/MysqlConnectionPool');
var flag = require('../manager/ErrorFlag');
var pool = mysql.mysqlPool;


exports.mTitleLoader = function (req, res) {

    var email = req.session.user_id;

    pool.getConnection(function (err, db) {

        if (err) {
            db.release();
            res.json(flag.FLAG_ERROR_JSON);
            console.log('false');
            return;
        }

        console.log('connected as id ' + db.threadId);

        db.query('SELECT TITLE_ID,TITLE_NAME FROM TITLE_INFO WHERE USER_ID=?',
            [email],
            function (err, rows) {
                db.release();
                if (!err) {
                    if(rows[0]==null) {
                        res.json(flag.FLAG_TITLE_LOADING_FAILED_JSON);
                    }else{
                        var result = flag.FLAG_SUCCESS_JSON;
                        result.contents = rows;
                        //console.log(result);
                        res.json(result);
                    }

                }else{
                    console.log(err);
                    res.json(flag.FLAG_ERROR_JSON);
                }
            });


    });

}

