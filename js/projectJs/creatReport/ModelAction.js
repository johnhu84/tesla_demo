//母版属性保存
function MubanSaveAttribute(e){
    var AttributeStyles = {};
    AttributeStyles.ModelSize=$(".muban #ModelSize").val()
    if(AttributeStyles.ModelSize==1){
        $(".reportContCont").css({"height":"1075px","width":"1567px"})
        $(".paperSize").css({"height":"1095px","width":"1587px"})
        $(".reportSlide").css("height",1147+"px")
        $(".reportRhide ").css("height",1147+"px")
    }
    AttributeStyles.borderColor=$(".muban .borderColor").val()
    AttributeStyles.borderWidth=$(".muban #borderWidth").val()
    AttributeStyles.borderType=$(".muban #borderType").val()
    AttributeStyles.LeftPadding=$(".muban #LeftPadding").val()
    AttributeStyles.TopPadding=$(".muban #TopPadding").val()
    AttributeStyles.RightPadding=$(".muban #RightPadding").val()
    AttributeStyles.BottomPadding=$(".muban #BottomPadding").val()
    $(".reportContCont").css({
        "border":AttributeStyles.borderWidth+"px "+ AttributeStyles.borderType+" "+AttributeStyles.borderColor,
        "padding-left":AttributeStyles.LeftPadding+"px",
        "padding-top":AttributeStyles.TopPadding+"px",
        "padding-right":AttributeStyles.RightPadding+"px",
        "padding-bottom":AttributeStyles.BottomPadding+"px",

    })
    localStorage.setItem("MubanAttribute",JSON.stringify(AttributeStyles))
    // AttributeStyles.
    return false
}
//页面属性保存
function PagerSaveAttribute(e){
    var AttributeStyles = {};
    // AttributeStyles.
    return false
}
//新建页面
function NewPage(e){
    if(Number($(".reportSlideNavUl .on").attr("data-num"))==1){
        $(".reportContCont").empty()
        $(".reportSlidecont .reportPager").find("p").removeClass("on")
        $(".reportSlidecont .reportPager").append("<p class='on'>页面"+($('.reportSlidecont .reportPager').find('p').length+1)+"</p>")
    }else{
        $(".reportContCont").empty()
        $(".reportSlidecont .MasterEdition").find("p").removeClass("on")
        $(".reportSlidecont .MasterEdition").append("<p class='on'>母版"+($('.reportSlidecont .MasterEdition').find('p').length+1)+"</p>")
    }
}
//删除页面 删除模板
function deletePager(e){
    if(Number($(".reportSlideNavUl .on").attr("data-num"))==1){
        var num=$(".reportSlidecont .reportPager").find("p.on").index()
        $(".reportSlidecont .reportPager").find("p.on").remove()
        if(num!=0){
            $(".reportSlidecont .reportPager").find("p:eq("+(num-1)+")").addClass("on")
        }else{
            $(".reportSlidecont .reportPager").find("p:eq(0)").addClass("on")
        }

    }else{
        var num=$(".reportSlidecont .MasterEdition").find("p.on").index()
        $(".reportSlidecont .MasterEdition").find("p.on").remove()
        if(num!=0){
            $(".reportSlidecont .MasterEdition").find("p:eq("+(num-1)+")").addClass("on")
        }else{
            $(".reportSlidecont .MasterEdition").find("p:eq(0)").addClass("on")
        }
    }
}
$(function(){
        // if($(window).height()<$(".reportCont").height()+72){
        //     $(".reportSlide").css("height",$(".reportCont").height()+"px")
        //     $(".reportRhide ").css("height",$(".reportCont").height()+"px")
        //     // $(".reportRhideCont").css("height",$(".reportCont").height()+"px")
        //     $(".paperSize").css("height",$(".reportCont").height()-75+"px")
        //     $(".reportContCont ").css("height",$(".reportCont").height()-75+"px")
        // }
    $(".reportContCont").css({"height":"1075px","width":"1567px"})
    $(".paperSize").css({"height":"1095px","width":"1587px"})
    $(".reportSlide").css("height",1147+"px")
    $(".reportRhide ").css("height",1147+"px")
})
