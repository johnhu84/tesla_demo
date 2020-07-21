/*
* 显示隐藏下拉事件
* */
function showSelect(e){
    $(e).parent("div").siblings(".selectModel").toggle();
}
/**
 * transparency 透明度下拉事件
 * */
function Transparency(){
    if($(".ModelTransparency").css("display")=="none"){
        $(".ModelTransparency").css("display","block")
    }
}
function selectModelSure(e){
    var checkedId=[];
    $(".selectModel input[type='checkbox']").each(function(){
        if($(this).prop("checked")){
            checkedId.push($(this).attr('id'));//向数组中添加元素
        }
    });
}


//放大缩小画布
$(function(){
    $(".pageScreenCanvas").css("transform","translate(-170px, 0px) scale(0.78)")
})

function enlarge(){//放大
    console.log()
    if(Number($(".enlargeNarrowCont .enlargeNarrowNum").text())<100){
        $(".enlargeNarrowCont .enlargeNarrowNum").text(Number($(".enlargeNarrowCont .enlargeNarrowNum").text())+5)
        $(".pageScreenCanvas").css("transform","scale("+(Number($(".enlargeNarrowCont .enlargeNarrowNum").text())+5)/100+")")
    }else{
        $(".enlargeNarrowCont .enlargeNarrowNum").text(100)
        $(".pageScreenCanvas").css("transform","scale("+100/100+")")
    }
}
function Narrow(){//缩小
    if(Number($(".enlargeNarrowCont .enlargeNarrowNum").text())>=5){
        $(".enlargeNarrowCont .enlargeNarrowNum").text(Number($(".enlargeNarrowCont .enlargeNarrowNum").text())-5)
        $(".pageScreenCanvas").css("transform","scale("+(Number($(".enlargeNarrowCont .enlargeNarrowNum").text())-5)/100+")")
        // $(".pageScreenCanvas").css("transform","translate(-170px, 0px) scale(0.78)")
    }else{
        $(".enlargeNarrowCont .enlargeNarrowNum").text(5)
        $(".pageScreenCanvas").css("transform","scale("+5/100+")")
    }

}
