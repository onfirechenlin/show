//以下部分为路径搜索算法部分,与表现层无关

//全局变量
var X = 6;//总行数
var Y = 7;//总列数
var types = 24;//图形种类

//布局矩阵
//为了算法方便，矩阵的第一行，第一列，最后一行，最后一列都标注为0，天然通路。
var arr = new Array(Y);
var tbl;//显示布局的table元素

var p1 = null;//搜索路径用的第1个点的坐标
var p2 = null;//搜索路径用的第2个点的坐标
var e1 = null;//第1个点对应的元素
var e2 = null;//第2个点对应的元素

//路径搜索，给出两个点，搜索出通路
//通路用可连通的点表示
function getPath(p1, p2) {
    //开始搜索前对p1,p2排序，使p2尽可能的在p1的右下方。
    //这样做可以简化算法
    if (p1.x > p2.x) {
        var t = p1;
        p1 = p2;
        p2 = t;
    }
    else if (p1.x == p2.x) {
        if (p1.y > p2.y) {
            var t = p1;
            p1 = p2;
            p2 = t;
        }
    }
    //通过分析连连看中两点之间的位置关系，逐步由简到难分析每一种类型
    //第一种类型， 两点是否在一条直线上，而且两点之间可直线连通
    if ((onlineY(p1, p2) || onlineX(p1, p2)) && hasLine(p1, p2)) {
        status = 'type 1';
        return [p1, p2];
    }
    //第二种类型， 如果两点中任何一个点被全包围，则不通。
    if (!isEmpty({ x: p1.x, y: p1.y + 1 }) && !isEmpty({ x: p1.x, y: p1.y - 1 }) && !isEmpty({ x: p1.x - 1, y: p1.y }) && !isEmpty({ x: p1.x + 1, y: p1.y })) {
        status = 'type 2';
        return null;
    }
    if (!isEmpty({ x: p2.x, y: p2.y + 1 }) && !isEmpty({ x: p2.x, y: p2.y - 1 }) && !isEmpty({ x: p2.x - 1, y: p2.y }) && !isEmpty({ x: p2.x + 1, y: p2.y })) {
        status = 'type 2';
        return null;
    }
    //第三种类型， 两点在一条直线上，但是不能直线连接
    var pt0, pt1, pt2, pt3;
    //如果都在x轴，则自左至右扫描可能的路径，
    //每次构造4个顶点pt0, pt1, pt2, pt3，然后看他们两两之间是否连通
    if (onlineX(p1, p2)) {
        for (var i = 0; i < Y; i++) {
            if (i == p1.y) {
                continue;
            }
            pt0 = p1;
            pt1 = { x: p1.x, y: i };
            pt2 = { x: p2.x, y: i };
            pt3 = p2;
            //如果顶点不为空，则该路不通。
            if (!isEmpty(pt1) || !isEmpty(pt2)) {
                continue;
            }
            if (hasLine(pt0, pt1) && hasLine(pt1, pt2) && hasLine(pt2, pt3)) {
                status = '(x:' + pt0.x + ',y:' + pt0.y + ')' + ', (x:' + pt1.x + ',y:' + pt1.y + ')' + ', (x:' + pt2.x + ',y:' + pt2.y + ')' + ', (x:' + pt3.x + ',y:' + pt3.y + ')';
                return [pt0, pt1, pt2, pt3];
            }
        }
    }
    //如果都在y轴，则自上至下扫描可能的路径，
    //每次构造4个顶点pt0, pt1, pt2, pt3，然后看他们两两之间是否连通
    if (onlineY(p1, p2)) {
        for (var j = 0; j < X; j++) {
            if (j == p1.x) {
                continue;
            }
            pt0 = p1;
            pt1 = { x: j, y: p1.y };
            pt2 = { x: j, y: p2.y };
            pt3 = p2;
            //如果顶点不为空，则该路不通。
            if (!isEmpty(pt1) || !isEmpty(pt2)) {
                continue;
            }
            if (hasLine(pt0, pt1) && hasLine(pt1, pt2) && hasLine(pt2, pt3)) {
                status = '(x:' + pt0.x + ',y:' + pt0.y + ')' + ', (x:' + pt1.x + ',y:' + pt1.y + ')' + ', (x:' + pt2.x + ',y:' + pt2.y + ')' + ', (x:' + pt3.x + ',y:' + pt3.y + ')';
                return [pt0, pt1, pt2, pt3];
            }
        }
    }
    //第四种类型， 两点不在一条直线上。
    //先纵向扫描可能的路径
    //同样，每次构造4个顶点，看是否可通
    for (var k = 0; k < Y; k++) {
        pt0 = p1;
        pt1 = { x: p1.x, y: k };
        pt2 = { x: p2.x, y: k };
        pt3 = p2;
        status = '(x:' + pt0.x + ',y:' + pt0.y + ')' + ', (x:' + pt1.x + ',y:' + pt1.y + ')' + ', (x:' + pt2.x + ',y:' + pt2.y + ')' + ', (x:' + pt3.x + ',y:' + pt3.y + ')';
        //特殊情况，如果pt0和pt1重合
        if (equal(pt0, pt1)) {
            //如果pt2不为空，则此路不通
            if (!isEmpty(pt2)) {
                continue;
            }
            if (hasLine(pt1, pt2) && hasLine(pt2, pt3)) {
                return [pt1, pt2, pt3];
            }
            else {
                continue;
            }
        }
            //特殊情况，如果pt2和pt3重合
        else if (equal(pt2, pt3)) {
            //如果pt1不为空，则此路不通
            if (!isEmpty(pt1)) {
                continue;
            }
            if (hasLine(pt0, pt1) && hasLine(pt1, pt2)) {
                return [pt0, pt1, pt2];
            }
            else {
                continue;
            }
        }
        //如果pt1, pt2都不为空,则不通
        if (!isEmpty(pt1) || !isEmpty(pt2)) {
            continue;
        }
        if (hasLine(pt0, pt1) && hasLine(pt1, pt2) && hasLine(pt2, pt3)) {
            return [pt0, pt1, pt2, pt3];
        }
    }
    //横向扫描可能的路径
    for (var k = 0; k < X; k++) {
        pt0 = p1;
        pt1 = { x: k, y: p1.y };
        pt2 = { x: k, y: p2.y };
        pt3 = p2;
        status = '(x:' + pt0.x + ',y:' + pt0.y + ')' + ', (x:' + pt1.x + ',y:' + pt1.y + ')' + ', (x:' + pt2.x + ',y:' + pt2.y + ')' + ', (x:' + pt3.x + ',y:' + pt3.y + ')';
        if (equal(pt0, pt1)) {
            if (!isEmpty(pt2)) {
                continue;
            }
            if (hasLine(pt1, pt2) && hasLine(pt2, pt3)) {
                return [pt1, pt2, pt3];
            }
        }
        if (equal(pt2, pt3)) {
            if (!isEmpty(pt1)) {
                continue;
            }
            if (hasLine(pt0, pt1) && hasLine(pt1, pt2)) {
                return [pt0, pt1, pt2];
            }
        }
        if (!isEmpty(pt1) || !isEmpty(pt2)) {
            continue;
        }
        if (hasLine(pt0, pt1) && hasLine(pt1, pt2) && hasLine(pt2, pt3)) {
            return [pt0, pt1, pt2, pt3];
        }
    }
    //status='type4';
    return null;
    /********** end type 4 **************/
}

function equal(p1, p2) {
    return ((p1.x == p2.x) && (p1.y == p2.y));
}

function onlineX(p1, p2) {
    return p1.y == p2.y;
}

function onlineY(p1, p2) {
    return p1.x == p2.x;
}

function isEmpty(p) {
    return (arr[p.y][p.x] == 0);
}

function hasLine(p1, p2) {
    if (p1.x == p2.x && p1.y == p2.y) {
        return true;
    }
    if (onlineY(p1, p2)) {
        var i = p1.y > p2.y ? p2.y : p1.y;
        i = i + 1;
        var max = p1.y > p2.y ? p1.y : p2.y;
        for (; i < max; i++) {
            var p = { x: p1.x, y: i };
            if (!isEmpty(p)) {
                break
            }
        }
        if (i == max) {
            return true;
        }
        return false;
    }
    else if (onlineX(p1, p2)) {
        var j = p1.x > p2.x ? p2.x : p1.x;
        j = j + 1;
        var max = p1.x > p2.x ? p1.x : p2.x;
        for (; j < max; j++) {
            var p = { x: j, y: p1.y };
            if (!isEmpty(p)) {
                break
            }
        }
        if (j == max) {
            return true;
        }
        return false;
    }
}

//以下部分为表现层部分,包括绘图, 初始化矩阵, 绑定鼠标事件...
//function $(id) { return document.getElementById(id) }

var it1, it2;//测试用
//图片基路径
var IMG_PATH = '/running/img/fanxi/';

//判断是否选对
function fun(id) {
    var imgid = id;
    var total = getcookie("total");
    var img = document.getElementById(imgid);
    if (img.getAttribute("alt") == "fq" || img.getAttribute("alt") == "zy" || img.getAttribute("alt") == "ag"
    || img.getAttribute("alt") == "mz" || img.getAttribute("alt") == "pd" || img.getAttribute("alt") == "jy"
    || img.getAttribute("alt") == "hx" || img.getAttribute("alt") == "gz" || img.getAttribute("alt") == "cx"
    || img.getAttribute("alt") == "wm" || img.getAttribute("alt") == "fz" || img.getAttribute("alt") == "ys") {
        total++;
                
        $("div#" + imgid+"div").append("<div style='height:60px;width:65px;background:#ccc;position:absolute;top:0px;opacity:0.8;'><span class='glyphicon glyphicon-ok' style='font-size:45px;margin-left:9px;margin-top:3px;color:red;'></span></div>");
        if (total == null) {
            total = 0;
        }
        setcookie("total", total, 0);
        if (total >= 12)
        {
            setcookie("ok", "password", 0);
            palert("", $("#success_div").html(), "过关了:0:location.reload();", "", "");
        }
    }
    else {
        setcookie("total", "0", 0);
        palert("选错啦", "~^~,选错了呢！加油，重新在来过吧，不知道可以去看通关攻略哦，要牢记24字社会主义核心价值观！", "再来一次:0:llk_init();removeMoreTr();", "", "");
    }
}

function removeMoreTr()
{
    $("#tbl tbody tr:gt(4)").remove();
}

//初始化
function llk_init() {
    //构造图片库
    var imgs = new Array(20);

    imgs[1] = 'fq';
    imgs[2] = 'mz';
    imgs[3] = 'wm';
    imgs[4] = 'hx';
    imgs[5] = 'zy';
    imgs[6] = 'pd';
    imgs[7] = 'gz';
    imgs[8] = 'fz';
    imgs[9] = 'ag';
    imgs[10] = 'jy';
    imgs[11] = 'cx';
    imgs[12] = 'ys';
    imgs[13] = '1';
    imgs[14] = '2';
    imgs[15] = '3';
    imgs[16] = '4';
    imgs[17] = '5';
    imgs[18] = '6';
    imgs[19] = '7';
    imgs[20] = '8';
    tbl = document.getElementById('tbl');
    //构造table
    for (var row = 1; row < Y - 1; row++) {
        var tr = tbl.insertRow(-1);
     //   tr.id = row;
        for (var col = 1; col < X - 1; col++) {
            var td = tr.insertCell(-1);
            //td.id = "img" + row + col + "td";
           // td.style.position ="relative";
           // td.class = "imgtd";
        }
    }
    //构造矩阵
    for (var i = 0; i < Y; i++) {
        arr[i] = new Array(X);
        for (var j = 0; j < X; j++) {
            arr[i][j] = 0;
        }
    }
    var total = (X - 2) * (Y - 2);
    var tmp = new Array(total);//产生随机位置用
    for (var i = 0; i < total; i++) {
        tmp[i] = 0;
    }

    //生成不重复数字数组
    for (var i = 0; i < total; i++) {
        tmp[i] = i + 1;
    }
    tmp.sort(function () { return 0.5 - Math.random(); });
   
    var c = 0;
    var index;
    for (var i = 1; i < Y - 1; i++) {
        for (var j = 1; j < X - 1; j++) {
            index = tmp[c++];
            tbl.rows[i - 1].cells[j - 1].innerHTML = '<div id="img' + i + j + 'div" style="position:relative;width:65px;padding-left:10%" ><img id="img' + i + j + '" onclick="fun(this.id);"src="' + IMG_PATH + imgs[index] + '.png" alt="' + imgs[index] + '" /></div>';
        }
    }
 //
}
