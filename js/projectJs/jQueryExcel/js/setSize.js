(function($) {
  $.fn.tableresize = function() {
    var _document = $("body");
    $(this).each(function() {
      if (!$.tableresize) {
        $.tableresize = {};
      }
      var _table = $(this);
      //设定ID
      var id = _table.attr("id") || "tableresize_" + (Math.random() * 100000).toFixed(0).toString();
      var tr = _table.find("tr").first(),
        ths = tr.children(),
        _firstth = ths.first();
      //设定临时变量存放对象
      var cobjs = $.tableresize[id] = {};
      cobjs._currentObj = null, cobjs._currentLeft = null;
      ths.mousemove(function(e) {
        var _this = $(this);
        var left = _this.offset().left,
          top = _this.offset().top,
          width = _this.width(),
          height = _this.height(),
          right = left + width,
          bottom = top + height,
          clientX = e.clientX,
          clientY = e.clientY;
        var leftside = !_firstth.is(_this) && Math.abs(left - clientX) <= 5,
          rightside = Math.abs(right - clientX) <= 5;
        if (cobjs._currentLeft || clientY > top && clientY < bottom && (leftside || rightside)) {
          _document.css("cursor", "e-resize");
          if (!cobjs._currentLeft) {
            if (leftside) {
              cobjs._currentObj = _this.prev();
            } else {
              cobjs._currentObj = _this;
            }
          }
        } else {
          cobjs._currentObj = null;
        }
      });
      ths.mouseout(function(e) {
        if (!cobjs._currentLeft) {
          cobjs._currentObj = null;
          _document.css("cursor", "auto");
        }
      });
      _document.mousedown(function(e) {
        if (cobjs._currentObj) {
          cobjs._currentLeft = e.clientX;
        } else {
          cobjs._currentLeft = null;
        }
      });
      _document.mouseup(function(e) {
        if (cobjs._currentLeft) {
          cobjs._currentObj.width(cobjs._currentObj.width() + (e.clientX - cobjs._currentLeft));
        }
        cobjs._currentObj = null;
        cobjs._currentLeft = null;
        _document.css("cursor", "auto");
      });
    });
  };
})(jQuery);