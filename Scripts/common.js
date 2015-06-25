//impromptu对话框的封装
//徐进钊
//2014-11-30
//示例：palert("提示","你过关了","休息一会:0:fun1","不玩了:1:fun2","知道了:2:fun3")
//休息一会:0:fun1注释“休息一会”是按钮，0是按钮的值，可选，fun1是点击按钮后执行的函数，可选
//注意，请不要用true false ，直接用0 1 2等表示较好
function palert(title,content,btn1,btn2,btn3)
{
	var json=btn; 
	var btntemp;
	var b1v; var fun1;
	var b2v; var fun2;
	var b3v; var fun3;
	var btntemp2;
	var btntempb;
	var a="test";
	var b="true"
	
	var b_value = new Object(); 
	var opt = new Array(); 

	var btn="{";
	if (btn1.indexOf(":")>=0)
	{
		btntemp=btn1.split(":");
		btn +="\""+btntemp[0]+"\":";
		btn +=btntemp[1]+"";
		b1v=btntemp[1];
		if (btntemp[2]!=null)
		{
			fun1=btntemp[2];
		}
	}
	if (btn2.indexOf(":")>=0)
	{
		btn +=",";
		btntemp=btn2.split(":");
		btn +="\""+btntemp[0]+"\":";
		btn +=btntemp[1]+"";
		b2v=btntemp[1];
		if (btntemp[2]!=null)
		{
			fun2=btntemp[2];
		}		
	}
	if (btn3.indexOf(":")>=0)
	{
		btn +=",";
		btntemp=btn3.split(":");
		btn +="\""+btntemp[0]+"\":";
		btn +=btntemp[1]+"";
		b3v=btntemp[1];
		if (btntemp[2]!=null)
		{
			fun3=btntemp[2];
		}
	}		
	btn +="}";

	 
	json = $.parseJSON(btn);  

	$(".jqibox").remove();
	$.prompt(content, {
		title: title,
		buttons: json,
		submit: function (e, v, m, f) {
			if (b1v!=null)
			{
				if (v==b1v)
				{
					if (fun1!=null)
					{
						eval(fun1);	
					}
				}
			}
			if (b2v!=null)
			{
				if (v==b2v)
				{
					if (fun2!=null)
					{
						eval(fun2);	
					}
				}
			}	
			if (b3v!=null)
			{
				if (v==b3v)
				{
					if (fun3!=null)
					{
						eval(fun3);	
					}
				}
			}					
		}
	});
	jqiplus();	
}



//可以渲染弹出框架按钮
//支持最多3个按钮
//.button-default  .button-active  .button-warning  支持三种样式
//徐进钊
//2014-11-28
function jqiplus()
{
	var obj=$(".jqibuttons button");
	if (obj.length==1)
	{
		obj.width("100%");	
	}
	else if (obj.length==2)
	{
		obj.width("50%");	
	}			
	else if (obj.length==3)
	{
		obj.width("33.3%");	
	}									
	obj.each(function(index, element) {
		if ($(this).text()=="关闭")
		{
			$(this).addClass("button-default");	
		}
		else
		{
			$(this).addClass("button-active");	
		}														
	});	
}
