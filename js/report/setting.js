
$(document).ready(function () {
    $('.RightCont .openClose').on('click', function () {
        $(this).next('.setting-content').slideToggle();
        $(this).toggleClass("elzhankai")
    });


    // 显示应用范围
    var $rangeElm = $('.use-range');
    $('input[name="Fruit"]').change(function() {
        if ($(this).val() === 'multiplePages') {
            $rangeElm.show()
        } else {
            $rangeElm.hide()
        }

    });
});


// 设置页显示隐藏
function spanDown() {
    var speedTime = 300;
    var num = $("#ReportSetUp").css("right")
    if (num != "0px") {
        $(".ReportSetUp").animate({
            "right": "0px"
        }, speedTime);
        $(".tipMask").addClass("tipMask1")
        //populates page and table spacings
        populatePageAndTableSpacings();

        // 记录标签个数
        globalObj.spacing._beforePageSize = $('#numOfPages').val();

        $('#pageSpacingUpDown').val(globalObj.spacing.pageSpacingUpDown)
        $('#pageSpacingLeftRight').val(globalObj.spacing.pageSpacingLeftRight)
        $('#chartSpacingLeftRight').val(globalObj.spacing.chartSpacingLeftRight)
        $('#chartSpacingUpDown').val(globalObj.spacing.chartSpacingUpDown)
        $('#numOfPages').val(globalObj.spacing.numOfPages)


        if (globalObj.spacing.apply === 1) {
            $('input[name=Fruit]').checked();
            $('#beforeOrAfterSelectedTable').val('after')
        }
    } else {
        $(".ReportSetUp").animate({
            "right": "-276px"
        }, speedTime);
        $(".tipMask").removeClass("tipMask1")
    }
}

// 保存设置
function saveSpacings(e) {
    var selectedValue = document.querySelectorAll('input[name=Fruit]:checked');
    var prevNumOfPages = globalObj.spacing.numOfPages;
    var pageSpacingUpDown = globalObj.spacing.pageSpacingUpDown;
    var pageSpacingLeftRight = globalObj.spacing.pageSpacingLeftRight;
    var chartSpacingUpDown = globalObj.spacing.chartSpacingUpDown;
    var chartSpacingLeftRight = globalObj.spacing.chartSpacingLeftRight;

    globalObj.spacing.pageSpacingUpDown = Number(document.getElementById('pageSpacingUpDown').value);
    globalObj.spacing.pageSpacingLeftRight = Number(document.getElementById('pageSpacingLeftRight').value);
    globalObj.spacing.chartSpacingUpDown = Number(document.getElementById('chartSpacingUpDown').value);
    globalObj.spacing.chartSpacingLeftRight = Number(document.getElementById('chartSpacingLeftRight').value);

    if (selectedValue.length > 0) {
        if (selectedValue[0].value == 'singlePage') {
            globalObj.spacing.numOfPages = 1;
        } else {
            globalObj.spacing.numOfPages = +document.getElementById('numOfPages').value;
            globalObj.spacing.useRange = $('#beforeOrAfterSelectedTable').val();
            globalObj.spacing.currentPage = $('#boxs').find('option:selected').index();
        }
    }

    globalObj.beforeOrAfterSelectedPage.beforeOrAfter = $('#beforeOrAfterSelectedTable').val();

    if (
        // 页面距离有变化或者图表之间距离有变化
        +pageSpacingUpDown !== +globalObj.spacing.pageSpacingUpDown ||
        +pageSpacingLeftRight !== +globalObj.spacing.pageSpacingLeftRight ||
        +chartSpacingUpDown !== +globalObj.spacing.chartSpacingUpDown ||
        +chartSpacingLeftRight !== +globalObj.spacing.chartSpacingLeftRight ||
        // 页数不一样
        +prevNumOfPages !== +globalObj.spacing.numOfPages
        ) {
            setTimeout(() => {
                _saveViewAndSettings(function () {
                    loadSettings();
                })
            }, 300);
    }

}
