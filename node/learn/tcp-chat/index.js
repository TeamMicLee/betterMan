/**
 * 模块依赖
 */

var net = require('net');

/**
 * 追踪连接数
 */

var count = 0, users = {};

/**
 * 创建服务器
 */

var server = net.createServer(function (conn) {
    // handler connection
    console.log('\033[90m New connection!\033[39m');
    conn.write(
        '\n > welcome to \033[92m node-chat\033[39m!'
        + '\n > '+ count +' other people are connected at this time.'
        + '\n > please write your name and press enter:'
    );
    count++;

    conn.setEncoding('utf8');
    
    function broadcast(msg, exceptMyself) {
        for (var i in users) {
            if (!exceptMyself || i != nickname) {
                users[i].write(msg);
            }
        }
    }

    /**
     * 时间格式化处理
     */
    function dateFormat(fmt,date) {
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }

    var nickname;
    conn.on('data', function (data) {
        data = data.replace('\r\n', '');
        if (!nickname) {
            if (users[data]) {
                conn.write('\033[93m > nickname already in use, try again:\033[39m');
                return;
            } else {
                nickname = data;
                users[nickname] = conn;
                broadcast('\033[90m > ' + nickname + ' joined the room\033[39m\n');
            }
        } else {
            if (data.toString().indexOf('date') > -1) {
                broadcast('\033[96m > ' + nickname + ' :\033[39m '+ dateFormat('yyyy-MM-dd hh:mm:ss', new Date()) +' \n', true);
            } else {
                broadcast('\033[96m > ' + nickname + ' :\033[39m '+ data +' \n', true);
            }
        }
    });

    conn.on('close', function () {
        count--;
        delete users[nickname];
        broadcast('\033[90m > ' + nickname + ' left the room\033[39m\n');
    });

});

/**
 * 监听
 */

server.listen(3000, function () {
    console.log('\033[96m server listening on *: 3000\033[39m');
});


