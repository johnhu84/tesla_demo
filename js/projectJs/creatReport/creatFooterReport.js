$(function() {
	//页面，母版，数据源切换
	$(".reportSlideNavUl li").click(function() {
		$(this).addClass("on").siblings().removeClass("on")
		var num = $(this).data("num")
		if (num == 1) {
			window.location.href="../../../../../fenzu/edit.jsp"
		} else if (num == 2) {
			window.location.href="../../../../../fenzu/creatFooterReport.html"
		} else if (num == 3) {
			$(".dataSource").css("display", "block").siblings().css("display", "none")
		}
	})
	//页面切换事件及绑定
	$(".reportPager").on("click", "p", function() {
		$(this).addClass("on").siblings().removeClass("on")
		$(".operationCont .yemianAction .PagerTitle").text($(this).text())
		$(".operationCont .yemianAction").show().siblings().hide()
	})
	//母版切换事件及绑定
	$(".MasterEdition").on("click", "p", function() {
		$(this).addClass("on").siblings().removeClass("on")
		$(".operationCont .muban .PagerTitle").text($(this).text())
		$(".operationCont .muban").show().siblings().hide()
	})

	$(".closeBtnR span").click(function() {
		if ($(".reportRhide").css("right") == "-256px") {
			$(".reportRhide").animate({
				right: '0px'
			});
		} else {
			$(".reportRhide").animate({
				right: '-256px'
			});
			//加载右侧编辑内容
		}

	})
})




//编辑栏显示隐藏
$(".title").click(function(){
	if ($(this).next().css("display") == 'none') {
		$(this).next().slideDown();
	} else {
		$(this).next().slideUp();
	}

})
$(".openClose").click(function openClose(){
	if ($(this).next().css("display") == 'none') {
		$(this).removeClass("elzhankai1").addClass("elzhankai")
		$(this).next().slideDown();
	} else {
		$(this).next().slideUp();
		$(this).removeClass("elzhankai").addClass("elzhankai1")
	}
})
