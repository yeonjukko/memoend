/**
 * Created by yeonjukko on 2016. 1. 29..
 */

var mysql = require('../manager/MysqlConnectionPool');
var flag = require('../manager/ErrorFlag');
var pool = mysql.mysqlPool;


exports.mDataLoader = function (req, res) {

    var memo_id = req.query.memo_id;
    console.log('memo_id=' + req.query.memo_id);

    pool.getConnection(function (err, db) {

        if (err) {
            db.release();
            res.json(flag.FLAG_ERROR_JSON);
            console.log('false');
            return;
        }

        console.log('connected as id ' + db.threadId);


        db.query('SELECT MEMO_DATA.CONTENT,MEMO_DATA.VIEW_COUNT,MEMO_DATA.TIMESTAMP,MEMO_INFO.TITLE_ID FROM MEMO_DATA,MEMO_INFO ' +
            'WHERE MEMO_DATA.MEMO_ID=MEMO_INFO.MEMO_ID and MEMO_DATA.MEMO_ID=? ',
            [memo_id],
            function (err, rows) {
                db.release();
                if (!err) {
                    if (rows[0] == null) {
                        res.json(flag.FLAG_MEMO_NAME_LOADING_FAILED_JSON);
                    } else {
                        var result = flag.FLAG_SUCCESS_JSON;
                        result.contents = rows;
                        res.json(result);
                    }

                } else {
                    console.log(err);
                    res.json(flag.FLAG_ERROR_JSON);
                }
            });


    });

}

