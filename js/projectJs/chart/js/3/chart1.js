(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['d3'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function(d3) {
            return factory(d3);
        };
    } else {
        root.D3LineChart = factory(d3);
    }
}(this, function(d3) {

    // http://ohgyun.com/574
    var getBoundingClientRect = function getBoundingClientRect(el) {
        var rect = el.getBoundingClientRect();

        if (typeof rect.width === 'undefined') {
            // IE에서의 rect는 읽기 전용으로 쓸 수 없다.
            return {
                top: rect.top,
                bottom: rect.bottom,
                left: rect.left,
                right: rect.right,
                width: rect.right - rect.left,
                height: rect.bottom - rect.top
            };
        }

        return rect;
    };

    /**
     * D3 Line Chart
     * @param element HTMLElement 차트를 표시할 DOM
     * @param options Object 차트 옵션을 표시 함
     */
    var D3LineChart = function(element, options) {
        if (!element) return;

        // element
        this.element = element;

        // 기본 설정
        var defaultOptions = {
            unit: options.unit || null,
            legendName: options.legendName || 'name',
            valueName: options.valueName || 'value'
        };

        // options
        this.options = defaultOptions;

        // initialize
        this.initialize();
    };
    D3LineChart.prototype = {

        /**
         * Initialize
         */
        initialize: function() {

            // Node 정의
            var element = this.element;

            // 사이즈 구함
            var rect = getBoundingClientRect(element);

            // 사이즈 정의
            var margin = {top: 20, right: 20, bottom: 20, left: 40},
                width = this.width = rect.width - margin.left - margin.right,
                height = this.height = rect.height - margin.top - margin.bottom;

            // SVG 생성
            this.svg = d3.select(element).append('svg')
                .attr('class', 'd3-line-chart')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        },

        /**
         * 데이터를 셋팅하고 라인을 그려줌
         */
        setData: function(data) {
            if (!this.svg) return;
            if (!data) return;
            this.setAxis(data);
            this.setLine(data);
        },

        /**
         * 라인의 축이 되는 X/Y축을 만듦
         */
        setAxis: function(data) {
            var self = this;

            // X축 정의
            var xScale = this.xScale = d3.scale.ordinal()
                .rangeRoundBands([0, this.width], 0.1);

            // Y축 정의
            var yScale = this.yScale = d3.scale.linear()
                .domain([0, 2])
                .range([this.height, 0]);

            // X축 생성
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .tickSize(0,0)
                .tickPadding(10)
                .orient('bottom');

            // Y축 생성
            var yAxis = d3.svg.axis()
                .scale(yScale)
                // .ticks(5)
                // .tickPadding(7)
                // .tickSize(-this.width)
                .orient('left');

            // X축 추가
            this.svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(xAxis);

            // Y축 추가
            var yAxisLine = this.svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(0,0)')
                .call(yAxis);

            // unit 설정
            if (this.options.unit) {
                yAxisLine.append('text')
                    .attr('class', 'unit')
                    .attr('y', 15)
                    .attr('x', -7)
                    .style('text-anchor', 'end')
                    .style('text-anchor', 'end')
                    .text(this.options.unit);
            }

            // X축 라벨 설정
            xScale.domain(data.map(function(d) {
                return d[self.options.legendName];
            }));
            this.svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(xAxis);
        },

        /**
         * 라인 그려 줌
         * @param data Array 데이터 배열
         */
        setLine: function(data) {
            var self = this,
                legendName = this.options.legendName,
                valueName = this.options.valueName,
                marginLeft = Math.round(self.xScale.rangeBand()/2);

            // 라인을 셋팅함
            var valueLine = d3.svg.line()
                .x(function(d) { return self.xScale(d[legendName]) + marginLeft; })
                .y(function(d) { return self.yScale(d[valueName]); });
            this.svg.append('path')
                .attr('class', 'line')
                .attr("fill","none")
                .attr("stroke","#347134")
                .attr("stroke-width","1")/*线条粗细*/
                .attr('d', valueLine(data));

            // 라벨 박스를 만듦
            var label = this.svg.selectAll('label')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'label');
            label.attr('transform', function(d) {
                return 'translate(' + (self.xScale(d[legendName]) +  + marginLeft) + ',' +
                    self.yScale(d[valueName]) + ')';
            });

            // 默认是圆形
            // label.append('circle')
            //     .attr("r", 4.5);


            //创建一个符号生成器
            var symbol = d3.svg.symbol()
                .size(function(d){return d.size})
                .type(function(d){return d.type});


            //添加菱形
            label.append('path')
                .attr("d",function(d){
                    var car = {size:"20", type:"diamond"};
                    return symbol(car)})
                .attr("fill",function(d,i){
                    //点颜色
                    return '#347134';
                });

            // 라인에 라벨을 만듦
            label.append("text")
                .attr("dy", -8)
                .text(function(d) { return d[self.options.valueName]; })
        }
    };

    return D3LineChart;
}));

var el = document.getElementById('chart1');
var lineChart = new D3LineChart(el, {});
lineChart.setData([{
    name: 'A',
    value: 1.8
}, {
    name: 'B',
    value: 1.4
}, {
    name: 'C',
    value: 0.6
}, {
    name: 'D',
    value: 0
}
]);
