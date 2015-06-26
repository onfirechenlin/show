// 定义当前浏览器高度
var nowHeight = $(window).height();
//关闭子菜单栏定时器
var hiddenListTime = null;
//关闭侧边菜单栏定时器
var  hiddenNavTime= null;
var navLi = $(".com-nav-con li");
// 载入时执行函数
var navListDiv = $(".com-nav-list div")

/*
 * 改变.wrap的高度和字体大小
 * @nowHeight [当前浏览器高度]
 */
function changeHeight(nowHeight) {
	if (nowHeight > 536) {
		$(".com-wrap").css('height', nowHeight + "px");
	} else {
		$(".com-wrap").css('height', "536px")
		nowHeight = 536;
	}
	var fontSize = Math.round(16 * nowHeight / 720);
	navLi.children().css('font-size', fontSize + "px");
	$(".com-nav-list span").css('font-size', fontSize + "px");
}

/*
 * 侧边菜单栏定时器执行函数
 * 
 */
function starNavTime() {
	$(".com-nav").stop(true, true).animate({
		"left": "-187px"
	}, 500);
	$(".com-meun").css('display', 'block');
	navLi.off("mouseover");
}

/*
 * 给list中li添加背景,并改变a标签样式 
 * @obj [当前执行对象]
 */
function addLibg(obj) {
	obj.css('background', '#063390');
	obj.children().css({
		color: '#fff',
	});
}

/*
 * 让list中li背景和a标签回到原来样式 
 * @obj [当前执行对象]
 */
function backLibg(obj) {
	obj.removeAttr('style').children().css({
		color: '#5e4c40'
	});
}

/*
 * 改变右侧按钮的margin-top值
 */
function changeTabTop() {
	var nowHeight = $(".com-tab").height();
	$(".com-tab").css('marginTop', -nowHeight/2);
}
changeTabTop();
changeHeight(nowHeight);
var subList = $(".com-nav-list div");
// 窗口大小改变执行函数，
$(window).on('resize', function() {
	nowHeight = $(window).height();
	changeHeight(nowHeight);
	// 为了防止窗口变大后出现多屏
	changeCon(tabDiv.eq(currentIndex));
});
// 鼠标移动到导航栏改变选项样式,并显示子菜单
function addMouseover() {
	navLi.on('mouseover', function() {
		var index = $(this).index();
		addLibg($(this));
		var listTop = index * ($(this).height()) - 1;
		$(".com-nav-list").css('top', listTop + "px");
		navListDiv.eq(index).css({display: 'block'}).siblings().removeAttr('style');
		clearTimeout(hiddenListTime);
	});
}
addMouseover();
// 鼠标移开隐藏子菜单栏
navLi.on('mouseout', function() {
	var index = $(this).index();
	backLibg($(this));
	hiddenListTime = setTimeout(function() {
		navListDiv.eq(index).css('display', 'none');
	}, 500)
});

// 当鼠标在子菜单栏上时，关闭hiddenListTimer,移开时重新开启
navListDiv.on('mouseover', function() {
	clearTimeout(hiddenListTime);
	var index = $(this).index();
	var nowObj = navLi.eq(index);
	addLibg(nowObj);
});

navListDiv.on('mouseout', function() {
	clearTimeout(hiddenListTime);
	var index = $(this).index();
	var nowObj = navLi.eq(index);
	backLibg(nowObj);
	hiddenListTime = setTimeout(function() {
		navListDiv.eq(index).css('display', 'none');
	}, 500)
});

// 点击meun显示侧边导航栏,并开一个定时器，在五秒后自动回到原来位置
$(".com-meun").on('click', function() {
	clearTimeout(hiddenNavTime);
	$(".com-nav").stop(true, true).animate({
		"left": "0"
	}, 500)
	$(this).css('display', 'none');
	addMouseover();
	hiddenNavTime = setTimeout(starNavTime, 5000)
});

//当鼠标在com-nav-con上时，清除timer,离开时重新开启定时器
$(".com-nav").on('mouseover', function() {
	clearTimeout(hiddenNavTime);
});
$(".com-nav-con").on('mouseout', function() {
	hiddenNavTime = setTimeout(starNavTime, 2000)
});

// 子菜单选项移入样式改变
$(".com-nav-list a").on('mouseover', function() {
	$(this).css('background', '#142371');
});
$(".com-nav-list a").on('mouseout', function() {
	$(this).removeAttr('style');
});

// 分享到微信功能
$(".com-wechat").on('mouseover', function(event) {
	var url = window.location.href;
	url = "http://blog.163.com/bitMaxImageGen.do?url=" + url;
	$(".com-wechat img").attr('src',url ).css('display', 'block');
});
$(".com-wechat").on('mouseout', function(event) {
	$(".com-wechat img").css('display', 'none');
});

// 分享到新浪微博
$(".com-weibo").on('click', function(event) {
	var title = $("title").text();
	var url = window.location.href;
	var imgUrl = "";
	window.open("http://service.weibo.com/share/share.php?url=" + url + "&type=icon&ralateUid=5023171824&language=zh_cn&appkey=2190523392&title=" +title + "&searchPic=" + imgUrl)
});


// 右上角链接跳转
$(".com-shortcut-btn a").on('click', function(event) {
	sessionStorage.clear();
	if($(this).index() == 1) {
		sessionStorage.cindex = 4;
	}else if($(this).index() == 2) {
		sessionStorage.cindex = 1;
	}
});
/**
 * 滚动功能区域
 * @type {[type]}
 */
var wrapListDiv = $(".com-main-con")
var tabDiv = $(".com-tab div")
var changeBtn = $(".com-change-btn");
// 右侧按钮个数
var len = changeBtn.length;
// 当前显示的索引值
var currentIndex = 0;
// 点击右边切换按钮切换显示内容
tabDiv.on('click', function() {
	currentIndex = $(this).index()
	changeCon($(this));
});

// 点击底部按钮切换显示内容
changeBtn.on('click', function() {
	currentIndex = $(this).parent().index();
	if (currentIndex == len - 1) {
		currentIndex = -1;
	}
	currentIndex += 1; 
	var nowTarget = tabDiv.eq(currentIndex);
	changeCon(nowTarget);
});

// 点击键盘上下按钮切换显示内容
$(document).on('keydown', function(event) {
	clearTimeout(scrollTimer);
	scrollTimer = setTimeout(function() {
		var nowKeyCode = event.keyCode;
		if (nowKeyCode == 40) {
			currentIndex = currentIndex == len - 1 ? 0 : currentIndex + 1;
		} else if (nowKeyCode == 38) {
			currentIndex = currentIndex == 0 ? 0 : currentIndex - 1
		}
		var nowTarget = tabDiv.eq(currentIndex);
		changeCon(nowTarget)
	}, 500);
});

// 鼠标滚轮滚动切换显示内容
// 防止用快速滚动，设置一个定时器,滚动和按键时开启.
var scrollTimer = null;
$(document).on('mousewheel', function(event, delta, deltaX, deltaY) {
	clearTimeout(scrollTimer);
	scrollTimer = setTimeout(function() {
		var nowKeyCode = event.keyCode;
		if (delta == -1) {
			currentIndex = currentIndex == len - 1 ? 0 : currentIndex + 1;
		} else {
			currentIndex = currentIndex == 0 ? 0 : currentIndex - 1;
		}
		var nowTarget = tabDiv.eq(currentIndex);
		changeCon(nowTarget)
	}, 500);
});
/*
 * 切换显示内容，currentIndex为当前需要显示的索引值
 * @obj [执行对象(为右侧按钮)]
 */
var comList = $(".com-main-con");
function changeCon(obj) {
	// 当只有一屏内容时return
	if(currentIndex > comList.length) return;
	var targetTop = -(currentIndex * wrapListDiv.height()) + "px";
	obj.siblings().removeAttr('class').children('span').removeAttr('class');
	obj.children('span').attr('class', 'selectspan');
	obj.siblings().children('p').stop(true, true).animate({
		left: "102px"
	}, 500);
	obj.children('p').stop(true, true).css('display', 'block').animate({
		left: "22px"
	}, 500);
	$(".com-wrap-list").stop(true, true).animate({
		top: targetTop
	}, 500);
	hiddenMeun(currentIndex);
	// 判断是否有本地存储的变量
	if(sessionStorage.cindex) {
		sessionStorage.cindex = currentIndex;
	} 
}
/*
 *只有在首屏时显示菜单和分享按钮
 *@currentIndex[当前显示的索引值]
 */
function hiddenMeun(currentIndex) {
	if(currentIndex != 0) {
		$(".com-share-btn").css('display', 'none');
	} else {
		$(".com-share-btn").css('display', 'block');
	}
}
 
 // 点击创建本地存储，为了防止冲突，先清除所有
$(".com-nav-list div a").on('click', function(event) {
	sessionStorage.clear();
	sessionStorage.cindex = $(this).index()
});
$(".com-nav-con li a").on('click', function(event) {
	sessionStorage.clear();
	sessionStorage.cindex = 0;
});
if(sessionStorage.cindex) {
	currentIndex = parseInt(sessionStorage.cindex);
	changeCon(tabDiv.eq(currentIndex));	
}

/*精英团队信息切换功能*/
var otSpeed = 0;
var otScrollObj = $(".ot-hk ul");
var otDisHeight;
if(otScrollObj.length != 0) {
	otDisHeight = otScrollObj[0].scrollHeight - otScrollObj[0].clientHeight;
}
$(".ot-arrowone").click(function(){
	otSpeed += 199
	if (otSpeed >= otDisHeight) {otSpeed -= 199 };
	otScrollObj.stop(true, true).animate({
		scrollTop: otSpeed
	})
})
$(".ot-arrowtwo").click(function(){
	otSpeed -= 199;
	if (otSpeed <= 0) {otSpeed = 0 };
	otScrollObj.stop(true, true).animate({
		scrollTop: otSpeed
	})
})

/*信息内页滚动功能*/
var topScrollObjNc = $(".news-info-msg");
var topScrollBarNc = $(".news-info-scrollbar");
var topScrollMoveNc = $(".news-info-scrollmove");
var topScrollDivNc = $(".news-info-scroll");
nowScroll(topScrollObjNc, topScrollBarNc, topScrollMoveNc, topScrollDivNc);


/*地标滚动功能*/
var centerScrollObj = $(".lm-detail-list");
var centerScrollBar = $(".lm-subcrollbar");
var centerScrollMove = $(".lm-subcrollmove");
var centerScrollDiv = $(".lm-subscroll");
var topScrollObj = $(".lm-msg-list");
var topScrollBar = $(".lm-scrollbar");
var topScrollMove = $(".lm-scrollmove");
var topScrollDiv = $(".lm-scroll");

nowScroll(topScrollObj, topScrollBar, topScrollMove, topScrollDiv);
/*
 *调用函数给元素添加自定义滚动条功能
 *@scrollObj [当前滚动对象] 
 *@scrollBar [固定滚动条]
 *@scrollMove [移动滚动条]
 *@scrollDiv [自定义滚动条元素]
*/
function nowScroll(scrollObj, scrollBar, scrollMove, scrollDiv) {
	// 内容高度
	if (scrollObj.length == 0) return;
	var conHeight = scrollObj[0].scrollHeight;
	// 可视高度
	var clientH = scrollObj.height();
	//可滚动高度
	var scrollH = conHeight - clientH;
	// 自定义滚动条可滚动高度
	var scrollDisHeight = scrollBar.height() - scrollMove.height();
	// 当前滚动高度
	var MoveHeight = 0;
	// 判断滚动条是否显示
	var isHidden = false;
	// 当可滚动高度小于等于0时，隐藏自定义滚动条
	if (scrollH <= 0) {
		scrollDiv.css('display', 'none');
		isHidden = true;
	}

	// 鼠标在scrollObj上滚动时，滚动当前自定义滚动条,如果当前没显示滚动条，直接return。
	scrollObj.on('mouseover', function(event) {
		scrollObj.on('mousewheel', function(event, delta) {
			if (isHidden) return;
			if (delta == -1) {
				MoveHeight = MoveHeight >= scrollH ? scrollH : MoveHeight + 5;
			} else {
				MoveHeight = MoveHeight <= 0 ? 0 : MoveHeight - 5;
			}
			scrollObj.scrollTop(MoveHeight);
			var moveTop = (scrollObj.scrollTop() * scrollDisHeight) / scrollH;
			moveTop = Math.round(moveTop);
			scrollMove.css('top', moveTop);
			if (MoveHeight < scrollH) {
				event.stopPropagation();
			}
		})
	})

	// 鼠标移开scrollObj时，解除滚动事件
	scrollObj.on('mouseout', function(event) {
		scrollObj.off("mousewheel");
	});

	// 当鼠标在自定义滚动条上按下并移动时执行改变scrollMove的TOP值，scrollObj同时滚动.
	scrollMove.on('mouseover', function() {
		$(document).on('mousedown', function(event) {
			// 鼠标与scrollMove纵向的距离
			var disY = event.clientY - scrollMove.position().top;
			$(document).on('mousemove', function(event) {
				var nowTop = event.clientY - disY;
				if (nowTop <= 0) {
					nowTop = 0;
				}
				if (nowTop >= scrollDisHeight) {
					nowTop = scrollDisHeight;
				}
				scrollMove.css('top', nowTop);
				MoveHeight = (nowTop * scrollH) / scrollDisHeight;
				scrollObj.scrollTop(MoveHeight);
				// 防止选中文字
				event.preventDefault();
			})
		})
	})

	$(document).on('mouseup', function(event) {
		$(document).off("mousedown");
		$(document).off("mousemove");
	});
}

// 地标点击显示信息详细内容
$(".lm-center-list p").on('click', function(event) {
	$(".lm-ceter-detail").css('display', 'block')
	nowScroll(centerScrollObj, centerScrollBar, centerScrollMove, centerScrollDiv)
});
// 点击关闭按钮关闭详细内容
$(".lm-btn-close").on('click', function(event) {
	$(".lm-ceter-detail").css('display', 'none');
});


/*新闻中心左右切换*/
var ncSpeed = 0;
var ncNewLen = $(".nc-change").length;
$(".nc-arrowone").on('click', function(event) {
	ncSpeed -= 300;
	if(ncSpeed == -(ncNewLen - 2) * 300) {
		ncSpeed += 300;
		return;
	}
	$(".nc-pic-tab").stop(true, true).animate({left: ncSpeed}, 500)
});
$(".nc-arrowtwo").on('click', function(event) {
	if(ncSpeed == 0) {
		return;
	}
	ncSpeed += 300;
	$(".nc-pic-tab").stop(true, true).animate({left: ncSpeed}, 500)
});

/*
 * [changeImg 实现大图滚动函数]
 * @num  {[type]} num              [需要的图片数量]
 * @divContainImgObj  {[type]} divContainImgObj [包含的图片的div的对象]
 * @leftArrow  {[type]} leftArrow        [点击向左按钮的对象]
 * @rightArrow  {[type]} rightArrow       [点击向右按钮的对象]
 * @CircleObj  {[type]} CircleObj        [图片底下小圆圈的对象]
 * @dis  {[type]} dis              [图片之间的间距]
 * @return {[type]}                  [description]
 */
function changeImg(num, divContainImgObj, leftArrow, rightArrow, CircleObj, dis) {
	var arr = [];
	for (var i = 0; i < num; i++) {
		arr[i] = i;
	};
	// 点击左键的触发事件
	leftArrow.on('click', function(event) {
		var a = arr.shift();
		arr.push(a);
		change(dis)
	});
	// 点击右键的触发事件
	rightArrow.on('click', function(event) {
		var a = arr.pop();
		arr.unshift(a);
		change(dis)
	});
	// 根据图片下面的索引圆圈来切换图片
	CircleObj.on("click", function(event) {
		arr.sort(numberOrder);
		$(this).attr('class', 'select').siblings().removeAttr('class');
		var this_index = $(this).index();
		var first; 
		var last;
		var len = arr.length;
		var mid_len = Math.round(len / 2);
		var cycleNumber =Math.abs(mid_len - this_index - 1);
		if (this_index <= mid_len - 1) {
			for (var i = 0; i < cycleNumber; i++) {
				last = arr.pop(); 
				arr.unshift(last);
			};
			change(dis);
		} else {
			for (var i = 0; i < cycleNumber; i++) {
				first = arr.shift(); 
				arr.push(first);
			};
			change(dis);
		}
	})
	function change(dis) {
		divContainImgObj.removeAttr('class');
		divContainImgObj.eq(arr[0]).css("z-index", "1").animate({left: dis*0},200).attr('class', 'next');
		divContainImgObj.eq(arr[1]).css("z-index", "2").animate({left: dis*1 +"px"},200).attr('class', 'middle');
		divContainImgObj.eq(arr[2]).css("z-index", "5").animate({left: dis*2 +"px"},200).attr('class', 'imgselect');
		divContainImgObj.eq(arr[3]).css("z-index", "4").animate({left: dis*3 +"px"},200).attr('class', 'middle');
		divContainImgObj.eq(arr[4]).css("z-index", "3").animate({left: dis*4 +"px"},200).attr('class', 'next');
		CircleObj.eq(arr[2]).attr('class', 'select').siblings().removeAttr('class');
	}change(dis);

	function numberOrder(a, b) {
		return a - b;
	}
}