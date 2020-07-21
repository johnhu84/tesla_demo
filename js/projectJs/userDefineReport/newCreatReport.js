$(function(){
	$(".selectBtn").click(function(){
			var num = parseInt($(this).attr("data-num"))
			console.log(num)
	        if(num==2){
				$(".modalBtnGroup").animate({"height":"86px"},600);
				$(".modalBtnOne").animate({"height":"86px"},600);
	            $(".modalBtnOne ul").animate({"height":"86px"},600);
				$(this).attr("data-num",1)
	        }else{
				$(".modalBtnGroup").animate({"height":"160px"},600);
				$(".modalBtnOne").animate({"height":"160px"},600);
	            $(".modalBtnOne ul").animate({"height":"160px"},600);
				$(this).attr("data-num",2)
	        }
	    });
		// 设置
		$(".openClose").click(function openClose() {
			if ($(this).next().css("display") == 'none') {
				$(this).removeClass("elzhankai1").addClass("elzhankai")
				$(this).next().slideDown();
			} else {
				$(this).next().slideUp();
				$(this).removeClass("elzhankai").addClass("elzhankai1")
			}
		})
        //数模操作按钮事件
        $(".bigModalBtnGroup>ul").on("click","li",function(){
            if($(this).hasClass("active")){
                $(this).removeClass("active")
            }else{
                $(this).addClass("active").siblings("li").removeClass("active")
            }
        })
})
function spanDown(){
	var num = $("#ReportSetUp").css("right")
	console.log(num)
	if(num!="0px"){
		$(".ReportSetUp").animate({"right":"0px"},600);
		$(".tipMask").addClass("tipMask1")
	}else{
		$(".ReportSetUp").animate({"right":"-276px"},600);
		$(".tipMask").removeClass("tipMask1")
	}
}
function toogle(th, toggleType) {

    var ele = $(th).children(".move");
    if (ele.attr("data-state") == "on") {
        ele.animate({
			left: "0"
		}, 300, function() {
            ele.attr("data-state", "off");
			$(th).removeClass("on").addClass("off");
			loadPoint(1,'')
		});

        	// toggle10Random(false,toggleType);


    } else if (ele.attr("data-state") == "off") {
		ele.animate({
			left: '17px'
		}, 300, function () {
			$(this).attr("data-state", "on");
			$(th).removeClass("off").addClass("on");
			loadPoint(1,'')

		});

			// toggle10Random(true,toggleType);


	}
}
