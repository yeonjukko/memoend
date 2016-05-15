/**
 * Created by yeonjukko on 2016. 1. 29..
 */

var mysql = require('../manager/MysqlConnectionPool');
var flag = require('../manager/ErrorFlag');
var pool = mysql.mysqlPool;


exports.mAllNameLoader = function (req, res) {

    var email = req.session.user_id;

    pool.getConnection(function (err, db) {

        if (err) {
            db.release();
            res.json(flag.FLAG_ERROR_JSON);
            console.log('false');
            return;
        }

        console.log('connected as id ' + db.threadId);

        //유저의 전체 메모의 날짜와 제목 불러오기
        db.query('SELECT MEMO_DATA.TIMESTAMP, MEMO_INFO.MEMO_NAME, MEMO_INFO.MEMO_ID, MEMO_DATA.VIEW_COUNT FROM TITLE_INFO, MEMO_INFO, MEMO_DATA WHERE MEMO_INFO.MEMO_ID = MEMO_DATA.MEMO_ID AND TITLE_INFO.TITLE_ID = MEMO_INFO.TITLE_ID AND TITLE_INFO.USER_ID = ?  ' +
        'Order By MEMO_DATA.TIMESTAMP DESC',
            [email],
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
            }
        )
        ;


    });

}

