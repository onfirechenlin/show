$(document).ready(function(){  
    if ($("#TestImage").attr("src")==null)
    {
        $("#TestImage").css({width:'0px',height:'0px'});
        $("#target_pic").css({width:'0px',height:'0px'});
    }
});

//有裁剪上传
function upLoadFile() {
   
	var options = {
		type: "POST",
		url: '/Files.ashx?num='+Math.random()+"&back_width="+$("#back_width").text()+"&back_height="+$("#back_height").text(),
		error: function () {  },
		success: showResponse
	};

    //上传loading
    $("#loading").html("<img src='/images/loading.gif' alt='' />");
    
	// 将options传给ajaxForm
	$("#target_pic").show();
	$('#AvatarForm').ajaxSubmit(options);
	
}

//无裁剪上传
function upLoadFile2() {
    
    var options = {
        type: "POST",
        url: '/Files.ashx?cut=no&num=' + Math.random() + "&back_width=" + $("#back_width").text() + "&back_height=" + $("#back_height").text(),
        error: function () { alert("dd"); },
        success: showResponse2
    };

    //上传loading
    $("#loading").html("<img src='/images/loading.gif' alt='' />");

    // 将options传给ajaxForm
    $("#target_pic").show();
    $('#AvatarForm').ajaxSubmit(options);
}
//陈有法
//2014.6.20
//pics
function showResponse2(htm) {

    
    if (htm.length > 5) {
        var Jcrop_api;
        var sp = htm.split("|");
        var h, w, ex;
        var min_w, min_h;  //动态变化后的size
        var sh, sw;         //原定的高宽的一半

        w = sp[1];
        h = sp[2];
        ex = sp[3];  //后缀名
       

        $("#loading").html("");
        //改样式width:100%;height:200px
        $("#pics").html("<div class='beremove'><a class='fancybox' rel='group' href='" + sp[0] + "'><img style='height:200px;' src=" + sp[0] + "></a></div>");
		$("#cut_result").val(sp[0]);
        pinit();
    }
    else {
        alert("图片大小不能超过6M！");
        $("#loading").html("");
        return false;
    }
}




function showResponse(htm) {
   
    if (htm.length > 5) {           
        var Jcrop_api;
        var sp = htm.split("|");
        var h, w, ex;
        var min_w, min_h;  //动态变化后的size
		var sh,sw;         //原定的高宽的一半
        w = sp[1];
        h = sp[2];
        ex = sp[3];  //后缀名
        if (ex == ".gif") {
          
            $("#loading").html("");
            $("#target_pic>div").remove();              //去除多余选框 
            $("#target_pic>div").show();
            Jcrop_api = $.Jcrop("#TestImage");
            Jcrop_api.destroy();                        //先移除，解决背景黑问题
            $("#target_pic>div").remove();              //去除多余选框  	    
            $("#BtnSaveAvatar").hide();
            $("#target_pic img").attr("src", sp[0]);
            $("#target_pic img").css({ width: w, height: h });
            $("#cut_result").val(sp[0]);
        }
        else {
           
            //if (w<150 || h<150)
            //{
            //    $("#loading").html("");
            //	alert("图片不能小于"+$("#cut_pic_width").text()+"*"+$("#cut_pic_height").text()+"像素，请上传其它图片。");
            //	return false;
            //}
            sw = parseInt($("#cut_pic_width").text()) / 2;
			sh = parseInt($("#cut_pic_height").text()) / 2;
			
            if (parseInt(w) < sw || parseInt(h) < sh) {
                $("#loading").html("");
                alert("图片不能小于" + $("#cut_pic_width").text() + "*" + $("#cut_pic_height").text() + "像素，请上传其它图片。");
                return false;
            }


            $("#loading").hide();

            $("#BtnSaveAvatar").html("<a class='btn btn-info medium' onclick='savepic()'>裁剪</a>");                 //裁剪按钮出现
            $("#upbox").html("<input name='idFile' type='file' id='idFile' onchange='upLoadFile()' class='input-001 w250' />");

            $("#target_pic img").attr("src", sp[0]);
            $(".jcrop-holder").css({ width: w, height: h });
            $(".jcrop-tracker").css({ width: w, height: h });
            $("#target_pic img").css({ width: w, height: h });


            //重新调整比例
            if (h >= $("#cut_pic_height").text() && w < $("#cut_pic_width").text())  //高大设定值,宽低小于设定值
            {
                $("#aspectRatio").text(w / $("#cut_pic_height").text());
                min_h = $("#cut_pic_height").text();
                min_w = w;
            }
            else if (h < $("#cut_pic_height").text() && w >= $("#cut_pic_width").text())  //高小设定值,宽大于设定值
            {
                $("#aspectRatio").text($("#cut_pic_width").text() / h);
                min_h = h;
                min_w = $("#cut_pic_width").text();
            }
            else if (h < $("#cut_pic_height").text() && w < $("#cut_pic_width").text())  //高小设定值,宽小于设定值
            {
                $("#aspectRatio").text(w / h);
                min_h = h;
                min_w = w;
            }
            else {
                min_h = $("#cut_pic_height").text();
                min_w = $("#cut_pic_width").text();
                $("#aspectRatio").text($("#cut_pic_width").text() / $("#cut_pic_height").text());
            }

            
            $("#resize_w").text(min_w);  //动态后宽度
            $("#resize_h").text(min_h);  //动态后高度

            $("#ncpic").text(sp[0]);                    //将被截图的图片路径+文件名
            $("#target_pic>div").remove();              //去除多余选框 
            $("#target_pic>div").show();
            
            Jcrop_api = $.Jcrop("#TestImage");
            Jcrop_api.destroy();                        //先移除，解决背景黑问题。
            Jcrop_api = $.Jcrop("#TestImage");
            Jcrop_api.setSelect([0, 0, 100, 100]);
            Jcrop_api.setOptions({                      //设置属性,更多属性在 http://www.im486.net/jcrop_canshu.html
                aspectRatio: $("#aspectRatio").text(),  //选框宽高比为1，即为正方形 
                bgColor: "#aaa",
                minSize: [min_w, min_h],
                onSelect: updateCoords,
                onChange: updateCoords
            });

            
        }
    }
    else {
        alert("图片大小不能超过2M！");
        $("#loading").html("");
        return false;
    }
}


function savepic()  //图片、数据库保存操作
{
	$.ajax({
		url: '/Handler.ashx',
		data: { 'x': $("#x").val(), 'y': $("#y").val(), 'w': $("#w").val(), 'h': $("#h").val(), pic: $("#ncpic").text(),'cut_pic_width': $("#resize_w").text(), 'cut_pic_height': $("#resize_h").text()},
		datatype: "text/json",
		type: 'post',
		success: function (o) {
			$("#cut_after").html("<img src=" + o + ">");   //裁剪所得的图片
			$("#cut_result").val(o);                       //裁剪所得的图片存放在文本框里,在用户确定移动并保存到数据库
		}
	});
	
	$("#target_pic>div").hide();   //裁剪后隐藏原图
	$("#BtnSaveAvatar").html("");    //裁剪后隐藏按钮
	
	return false;    
}


function updateCoords(c){      
	$('#x').val(c.x);
	$('#y').val(c.y);
	$('#w').val(c.w);
	$('#h').val(c.h);
};