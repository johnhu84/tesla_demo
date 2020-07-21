function lineZFChart(id, dataset, xMarks, title, padding, width, height) { //正负极折线图
	var dataset = dataset;
	var xMarks = xMarks;
	var padding = padding;
	var h = height;
	var w = width;
	var num = 2;
	var title = title;
	var subTitle = "temperature"; //定义画布
	if (h <= 88) {
		num = 2
	} else if (h > 88 && h <= 176) {
		num = 5
	} else {
		num = 10
	}
	var svg = d3.select("#" + id)
		.append("svg").attr("width", w).attr("height", h); //添加标题
	svg.append("text").text(title)
		.attr("class", "title").attr("x", w / 2).attr("y", function() {
			if (title != null) {
				return 15
			} else {
				return 0
			}
		}); //添加副标题 

	// svg.append("text").text(subTitle)
	// 	.attr("class", "subTitle").attr("x", w/2).attr("y", 40); //横坐标轴比例尺 
	var maxNum = d3.max(dataset);
	var minNum = d3.min(dataset);
	var DataNum1 = 0;
	var DataNum2 = d3.max(dataset);
	if (minNum > 0) {
		DataNum1 = 0;
		DataNum2 = d3.max(dataset);
	} else if (minNum < 0 && maxNum < 0) {
		DataNum1 = 0;
		DataNum2 = d3.min(dataset);
	} else {
		if (Math.abs(d3.min(dataset)) > d3.max(dataset)) {
			DataNum1 = d3.min(dataset);
			DataNum2 = -d3.min(dataset);
		} else {
			DataNum1 = -d3.max(dataset);
			DataNum2 = d3.max(dataset);
		}
	}
	var xScale = d3.scaleLinear().domain([0, dataset.length - 1]).range([0, w - padding.left - padding.right]); //这个range相当于横轴的左右平移 //纵坐标轴比例尺 
	var yScale = d3.scaleLinear().domain([DataNum1, DataNum2]).range([h - padding.top - padding.bottom, 0]); //定义横轴网格线 
	var xInner = d3.axisBottom().scale(xScale).tickSize(-(h - padding.top - padding.bottom), 0) //调整网格线长度
		.ticks(dataset.length); //添加横轴网格线 
	svg.append("g").attr("class", "inner_line").attr("transform", "translate(" + padding.left + "," + (h - padding.bottom) +
			")") //用来把纵的网格线上移的 
		.call(xInner).selectAll("text").text(); //定义纵轴网格线
	var yInner = d3.axisLeft().scale(yScale).tickSize(-(w - padding.left * 2), 0).tickFormat("").ticks(); //添加纵轴网格线 
	var yBar = svg.append("g").attr("class", "inner_line").attr("transform", "translate(" + padding.left + "," + padding
		.top + ")").call(yInner); //定义横轴 
	var xAxis = d3.axisBottom().scale(xScale).ticks(dataset.length); //添加横坐标轴并通过编号获取对应的横轴标签 
	var xBar = svg.append("g")
		.attr("class", "axis").attr("transform", "translate(" + padding.left + "," + (h - padding.bottom + padding.top) / 2 +
			")") //用来上下平移横轴位置 
		.call(xAxis).selectAll("text")
		.text(function(d) {
			return xMarks[d];
		}); //定义纵轴 
	var axisLabelText = svg.append("text") // axis label
		.attr("transform", "rotate(-90)")
		.attr("y", 0)
		.attr("x", -(h / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style('font-size', 11)
	// .text("百分比")
	// .style('fill', '#697882')
	// .style('font-weight', 'bold');

	var legendText_1 = svg.append('text') // legend text 1
		.classed('legend-text', true)
		.attr('x', (w / 2))
		.attr('y', h)
	// .text('X轴').style("text-anchor", "end");//添加
	var yAxis = d3.axisLeft().scale(yScale).ticks(num); //这个是细分度x轴刻度
	//添加纵轴 
	var yBar = svg.append("g").attr("class", "axis").attr("transform", "translate(" + padding.left + "," + (padding.top) +
		")").call(yAxis);
	//添加折线 
	var line = d3.line().x(function(d, i) {
		return xScale(i);
	}).y(function(d) {
		return yScale(d);
	});
	var path = svg.append("path").attr("transform", "translate(" + padding.left + "," + padding.top + ")")
		.attr("d", line(dataset)).style("fill", "#F00").style("fill", "none").style("stroke-width", 1)
		.style("stroke", "#09F").style("stroke-opacity", 0.9); //添加系列的小圆点 

	const updateDot = svg.append("g")
		.attr("class", "chart")
		.selectAll("dot")
		.data(dataset)
	const enterDot = updateDot.enter();
	enterDot.append("path")
		.attr("class", "dot")
		.attr("transform", function(d, i) {
			return `translate(${xScale(i)+padding.left},${yScale(d)+padding.top})`
		})
		.attr("d", d3.symbol().type(function(d, i) {
			var n = 2 //1加号 2菱形 3正方形 4星星 5三角号 6三叉符号
			console.log(n);
			if (d > 90) {
				n = 1
			}
			return d3.symbols[n];
		}).size(100))
		.style("fill", function(d) {
			if (d > 90) {
				return "red"
			} else {
				return "green"
			}
		})
	var texts = svg
		.selectAll("MyText")
		.data(dataset)
		.enter()
		.append("text")
		.attr("fill", "black")
		.attr(
			"transform",
			"translate(" + padding.left + "," + padding.top + ")"
		)
		.attr("x", function(d, i) {
			return i * ((w - 2 * padding.left) / (dataset.length - 1)) - 5
		})
		.attr("y", function(d, i) {
			return yScale(d);
		})
		.text(function(d) {
			return d;
		});
}


function lineZChart(id, dataset, xMarks, title, padding, width, height) { //正极折线图
	var dataset = dataset;
	var xMarks = xMarks;
	var padding = padding;
	var num = 2;
	var h = height;
	var w = width;
	var title = title;
	var subTitle = "temperature";
	if (h <= 88) {
		num = 2
	} else if (h > 88 && h <= 176) {
		num = 5
	} else {
		num = 10
	}
	//定义画布 
	var svg = d3.select("#" + id)
		.append("svg").attr("width", w).attr("height", h); //添加标题 
	svg.append("text").text(title)
		.attr("class", "title").attr("x", w / 2).attr("y", function() {
			if (title != null) {
				return 15
			} else {
				return 0
			}
		}); //添加副标题 

	// svg.append("text").text(subTitle)
	// 	.attr("class", "subTitle").attr("x", w/2).attr("y", 40); //横坐标轴比例尺 
	var xScale = d3.scaleLinear().domain([0, dataset.length - 1]).range([0, w - padding.left - padding.right]); //这个range相当于横轴的左右平移 //纵坐标轴比例尺 
	var yScale = d3.scaleLinear().domain([0, d3.max(dataset)]).range([h - padding.top - padding.bottom, 0]); //定义横轴网格线 
	var xInner = d3.axisBottom().scale(xScale).tickSize(-(h - padding.top), 0) //调整网格线长度
		.ticks(dataset.length); //添加横轴网格线 
	svg.append("g").attr("class", "inner_line").attr("transform", "translate(" + padding.left + "," + h + ")") //用来把纵的网格线上移的 
		.call(xInner).selectAll("text").text(); //定义纵轴网格线
	var yInner = d3.axisLeft().scale(yScale).tickSize(-(w - padding.left * 2), 0).tickFormat("").ticks(); //添加纵轴网格线 
	var yBar = svg.append("g").attr("class", "inner_line").attr("transform", "translate(" + padding.left + "," + padding
		.top + ")").call(yInner); //定义横轴 
	var xAxis = d3.axisBottom().scale(xScale).ticks(dataset.length); //添加横坐标轴并通过编号获取对应的横轴标签 
	var xBar = svg.append("g")
		.attr("class", "axis").attr("transform", "translate(" + padding.left + "," + (h - padding.bottom) + ")") //用来上下平移横轴位置 
		.call(xAxis).selectAll("text")
		.text(function(d) {
			return xMarks[d];
		}); //定义纵轴 
	var axisLabelText = svg.append("text") // axis label
		.attr("transform", "rotate(-90)")
		.attr("y", 0)
		.attr("x", -(h / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style('font-size', 11)
	// .text("百分比")
	// .style('fill', '#697882')
	// .style('font-weight', 'bold');

	var legendText_1 = svg.append('text') // legend text 1
		.classed('legend-text', true)
		.attr('x', (w / 2))
		.attr('y', h)
	// .text('X轴').style("text-anchor", "end");//添加
	var yAxis = d3.axisLeft().scale(yScale).ticks(num); //这个是细分度x轴刻度
	//添加纵轴 
	var yBar = svg.append("g").attr("class", "axis").attr("transform", "translate(" + padding.left + "," + (padding.top) +
		")").call(yAxis);
	//添加折线 
	var line = d3.line().x(function(d, i) {
		return xScale(i);
	}).y(function(d) {
		return yScale(d);
	});
	var path = svg.append("path").attr("transform", "translate(" + padding.left + "," + padding.top + ")")
		.attr("d", line(dataset)).style("fill", "#F00").style("fill", "none").style("stroke-width", 1)
		.style("stroke", "#09F").style("stroke-opacity", 0.9); //添加系列的小圆点 

	const updateDot = svg.append("g")
		.attr("class", "chart")
		.selectAll("dot")
		.data(dataset)
	const enterDot = updateDot.enter();
	enterDot.append("path")
		.attr("class", "dot")
		.attr("transform", function(d, i) {
			return `translate(${xScale(i)+padding.left},${yScale(d)+padding.top})`
		})
		.attr("d", d3.symbol().type(function(d, i) {
			var n = 2 //1加号 2菱形 3正方形 4星星 5三角号 6三叉符号
			if (d > 90) {
				n = 1
			}
			return d3.symbols[n];
		}).size(100))
		.style("fill", function(d) {
			if (d > 90) {
				return "red"
			} else {
				return "green"
			}
		});
	var texts = svg
		.selectAll("MyText")
		.data(dataset)
		.enter()
		.append("text")
		.attr("fill", "black")
		.attr(
			"transform",
			"translate(" + padding.left + "," + padding.top + ")"
		)
		.attr("x", function(d, i) {
			return i * ((w - 2 * padding.left) / (dataset.length - 1)) - 5
		})
		.attr("y", function(d, i) {
			return yScale(d) - 10;
		})
		.text(function(d) {
			return d;
		});
}

function lineMoreChart(id) { //c3多条折线图表
	var chart = c3.generate({
		bindto: '#' + id,
		data: {
			columns: [
				['data1', -30, 200, -100, -300, 150, 250, 300],
				['data2', -50, 20, -10, 40, 15, 25, 56]
			],
			axes: {
				// data1: 'y',
				// data2: 'y2'
			}
		},
		axis: {
			y: {
				label: 'Y Axis Label'
			},
			y2: {
				show: false,
				label: 'Y2 Axis Label'
			},
			x: {
				type: 'category', //x轴文字
				categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

			}
		},
		grid: { //网格线
			x: {
				show: true
			},
			y: {
				show: true,
				lines: [{
					value: 100,
					class: 'grid100',
					text: 'LABEL 100'
				}, {
					value: -100,
					class: 'grid800',
					text: 'LABEL -100'
				}]
			}
		}
	})
}

function pieChart(id, height, width) { //c3饼图
	var chart = c3.generate({
		bindto: '#' + id,
		data: {
			// iris data from R
			columns: [
				['data1', 30],
				['data2', 120],
			],
			type: 'pie',
			onclick: function(d, i) {},
			onmouseover: function(d, i) {},
			onmouseout: function(d, i) {}
		},
		legend: {
			position: 'right top'
		}
	});
	chart.resize({
		height: height,
		width: width
	})
}

function barZChart(id, data, title, margin, width, height) { //正极柱图
	var dom = document.getElementById(id);
	var height = dom.offsetHeight;
	var width = dom.offsetWidth;
	var margin = margin;
	const x = d3.scaleBand()
		.domain(data.map(d => d.letter))
		.range([margin.left, width])
		.padding(0.5);
	const y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.frequency)]).nice()
		.range([height - margin.bottom, margin.top]);


	var xAxis = g => g
		.attr("transform", function() {
			return `translate(0,${height - margin.bottom})`
		})
		.call(d3.axisBottom(x).tickSizeOuter(0))
		.classed('xAxis', true);
	var yAxis = g => g
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y).tickSize(-width).tickFormat(d3.format(",.2s")))
		.call(g => g.select(".domain").remove())
		.classed('yAxis', true);

	const svg = d3.select("#" + id)
		.append("svg").attr("width", width)
		.attr("height", height);

	const xAxisG = svg.append("g")
		.call(xAxis);

	const yAxisG = svg.append("g")
		.call(yAxis);
	// 	const theGraph1 = svg.selectAll(".yAxis").append("g").attr("class", "green").attr("transform", function(d) {
	// 		// 标识线一
	// 		const num = ((height - margin.top - margin.bottom) / 10) * 3 + 20.5 + 22.5
	// 		return "translate(0," + num + ")"
	// 
	// 	}).append("line").style("stroke", "rgb(0,128,0)").attr("x2", width);
	// 
	// 	const theGraph2 = svg.selectAll(".yAxis").append("g").attr("class", "red").attr("transform", function(d) {
	// 		// 标识线二
	// 		const num = ((height - margin.top - margin.bottom) / 10) * 6 + 20.5 + 22.5
	// 		return "translate(0," + num + ")"
	// 
	// 	}).append("line").style("stroke", "rgb(255,0,0)").attr("x2", width);
	// 
	// 	const text1 = svg.selectAll(".green").append("text").text("标识线一").attr("y", "-5")
	// 		.attr("x", width - 40).attr("dy", "0.32em").style("fill", "green")
	// 
	// 	const text2 = svg.selectAll(".red").append("text").text("标识线二").attr("y", "-5")
	// 		.attr("x", width - 40).attr("dy", "0.32em").style("fill", "red")
	// .attr("transform", "rotate(-90)")
	const theGraph = svg.append("g") // the graph

		.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", d => x(d.letter))
		.attr("y", d => y(d.frequency))
		.attr("height", d => y(0) - y(d.frequency))
		.attr("width", x.bandwidth()).attr("fill", function(d) {
			if (d.frequency > 90) {
				return "green"
			} else if (d.frequency <= 90 && d.frequency >= 60) {
				return "yellow"
			} else if (d.frequency < 60) {
				return "red"
			}

		});

	const gridlines = svg.selectAll('line') // gridlines
		.style("stroke", function(d) {
			return "#EBF0F5"
		});

	const axisLabelText = svg.append("text") // axis label
		.attr("transform", "rotate(-90)")
		.attr("y", 0)
		.attr("x", -(height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style('font-size', 11)
		.text("百分比")
		.style('fill', '#697882')
		.style('font-weight', 'bold');

	const legendText_1 = svg.append('text') // legend text 1
		.classed('legend-text', true)
		.attr('x', (width / 2))
		.attr('y', height + 20)
		.text('X轴').style("text-anchor", "end");

	// const legendText_2 = svg.append('text') // legend text 2
	// 	.classed('legend-text', true)
	// 	.attr('x', 50)
	// 	.attr('y', height + 40)
	// 	.text('title');

	const valueOnBar = svg.selectAll("bar") // value on top of bar
		.data(data)
		.enter().append("text")
		.attr("class", "bar")
		.attr("text-anchor", "middle")
		.attr("x", function(d) {
			return x(d.letter) + x.bandwidth() / 2
		})
		.attr("y", function(d) {
			return y(d.frequency) - 5;
		})
		.text(function(d) {
			return d.frequency + ' %';
		})
		.style('font-size', 12)
		.style('font-weight', 'bold');

	xAxisG.selectAll('.tick')
		.each(function(d, i) {
			if (d === 'Saturday' || d === 'Sunday') {
				d3.select(this)
					.selectAll('text')
					.style('fill', '#AF235F')
					.style('font-weight', 'bold')
				// .style('font-size', '16px');

			} else {
				d3.select(this).selectAll('text').style('fill', '#697882')
					.style('font-weight', 'bold');

			}
		});

	yAxisG.selectAll('.tick')
		.each(function(d, i) {
			d3.select(this)
				.selectAll('text')
				.style('fill', '#697882')
				.style('font-family', 'arial')
		});

	const legendTextStyles = svg.selectAll('.legend-text') // style for legend text
		.style('font-size', '14')
		.style('fill', '#879BAA');
}


var Chart = Chart || {};
Chart.barChart = function(options)
    {//帕雷图表柱状图带标识线
        var defaults = {
            selector: '',
            data: {},    // data
            group: '',
            colorRange: ["brown", "steelblue"],
            width: 960,
            height: 500,
            yAxisLabel: '',
            showLegend: true,
            horizontal: false,
            dimensionName: '',
            selectColor: "red",
            onClick: function(){},
        };

        // merge defaults and options,
        // overwriting any default setting specified in options
        var settings = $.extend( {}, defaults, options );

        settings.data = $.extend(true, [], settings.data);

        var margin = {top: 0, right: 0, bottom: 0, left: 0};//{top: 50, right: 20, bottom: 30, left: 40},
			var width = settings.width - margin.left - margin.right,
            height = settings.height - margin.top - margin.bottom;

        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var x1 = d3.scale.ordinal();//定义域和值域不一定是连续的，都是离散的。那就要用到序数比例尺了

        var y = d3.scale.linear()//生成线性比例尺
            // .domain([-100,100])
            .range([height, 0]);

        var color = d3.scale.ordinal()
            .range(settings.colorRange);

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"))
            // .ticks(10)//有几个刻度
            ;

        var categoryNames = d3.keys(settings.data[0]).filter(function(key) { return key !== settings.dimensionName; });

        settings.data.forEach(function(d) {
            d.categories = categoryNames.map(function(name) { return {name: name, value: +d[name]}; });
        });

        x0.domain(settings.data.map(function(d) { return d[settings.dimensionName]; }));

        x1.domain(categoryNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([-100, d3.max(settings.data, function(d) { return d3.max(d.categories, function(d) { return d.value; }); })]);

        var svg = d3.select(settings.selector).append("svg")
            .attr("class", "bar-chart")
            .attr("width", !settings.horizontal ? (width + margin.left + margin.right) : (height + margin.top + margin.bottom))
            .attr("height", !settings.horizontal ? (height + margin.top + margin.bottom) : (width + margin.left + margin.right))
            .append("g")
            .attr(
                "transform",
                "translate(" + (!settings.horizontal ? margin.left : (settings.height)) + "," + margin.top + ")"+
                (settings.horizontal ? " rotate(90)" : '')
            );

        var xAxisEl = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
			
			
		var  titleG = svg.append("g") //插入标题
            .attr("class", "title").style("fill","red")
			// titleG.append("text").text("标题wwwwwwwwwwwwwwwwwwwwww").attr("transform", function(){
			// 	// this.getComputedTextLength()//获取width
			// 	// this.getBoundingClientRect().width//获取width
			// 	var width1 = width/2-this.getBoundingClientRect().width/2 
			// 	return "translate("+width1+",0)"
			// }).attr("y",20).style("fill", "red")
			titleG.append("foreignObject").attr("width", width).attr("height","30").attr("y","-30").attr("class","titleInput").html('<div contenteditable="true"></div>')
			
			
        if(settings.horizontal)
        {
            xAxisEl
                .selectAll("text")
                .attr("transform", "rotate(-90)")
                .attr("x", "-13")
                .attr("y", "-3")
                .style("text-anchor", "end")
        }

        var yAxisEl = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        yAxisEl.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(settings.yAxisLabel);

        if(settings.horizontal)
        {
            yAxisEl
                .selectAll("text")
                .attr("transform", "rotate(-90)")
                .attr("x", "0")
                .attr("y", "-13")
                .style("text-anchor", "middle")
        }

        // this.updateBar = function(chartData)
        // {
        // console.log("TRYING TO UPDATE");

        // every chart works with a copy of the data
        // chartData = $.extend(true, [], chartData);
        // console.log(settings.data);

        // console.log(chartData);

        // ===========================================================================
        var layer = svg.selectAll(".category")
            .data(settings.data);

        layer.exit().remove();

        var containers = layer.enter().append("g")
            .attr("class", "g")//每个柱子添加class
            .attr("transform", function(d)
            {
                return "translate(" + x0(d[settings.dimensionName]) + ",0)"; }
                );

        var bars = containers.selectAll("rect")
        // .data(function(d) { return d; })
        // .data(function(d) { d.categories = d.categories[0]; console.log(d); return d; })
            .data(function(d) { return d.categories; })

        bars.exit().remove();
        bars.enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.name); })
            .attr("y", function(d) { if(!isNaN(d.value)) return y(d.value); })
            .attr("height", function(d) { if(!isNaN(d.value)) {return height - y(d.value);} })
            .style("fill", function(d) {

                var v = d.value;

                if (v <= 60){
                    return 'red';
                }

                if (v > 60 && v <= 80){
                return 'yellow';
                     }

                if (v > 80){
                    return 'lightgreen';
                }

            }
                );

        //添加文字元素
        var rectPadding = 4;
        containers.selectAll(".MyText")
            .data(function(d) { return d.categories; }).enter().append("text")
            // .data(settings.data)
            // .enter()
            // .append("text")
            .attr("class","MyText")
            // .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .attr("x", function(d,i){
                return x0(d[settings.dimensionName]);
            } )
            .attr("y",function(d){
                return y(d.value);
            })
            .attr("dx",function(){
                return (x1.rangeBand() - rectPadding)/2;
            })
            .attr("dy",function(d){
                return 20;
            })
            .text(function(d){
                return d.value;
            });

        containers.on('click', function(d,i){
            settings.onClick(d, i, this);
        });

        //背景横线
        // svg.selectAll(".y.axis")
        //     .selectAll(".tick line")
        //     .call(yAxis)
        //     .attr("x2", width);

        // legend
        if(settings.showLegend)
        {
            var arr  =new Array();
            arr[0] = "样本";
            var legend = svg.selectAll(".legend")
                .data(arr.slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });
        }
        // };

        var getBarData = function(index)
        {
            var data = null;
            var bar = containers
                .filter(function(d,i){ return i === index; })
                .each(function(d){ data = d; });

            return data;
        };

        var selectBar = function(index)
        {
            var bar = containers
                .filter(function(d,i){ return i === index; })

            var classes = bar.attr("class");

            if(classes.indexOf("selected") < 0)
                bar.attr("class", classes+" selected");
            else
                return deselectBar(index);

            return true;
        };

        var deselectBar = function(index)
        {
            var bar = containers
                .filter(function(d,i){ return i === index; })

            var classes = bar.attr("class");

            if(classes.indexOf("selected") > 0)
                bar.attr("class", "g");
            else
                return selectBar(index);

            return false;

            // containers
            //   .filter(function(d,i){ return i === index; })
            //   .select("rect")
            //   .style("fill", "red");
        };

        var createHorizontalLine = function(yPos,c)
        {
            svg.append("g")
                .attr("transform", "translate(0, "+y(yPos)+")")
                .append("line")
                .attr("x2", width)
                .style("stroke", c)
                .style("stroke-width", "5px")
        };

        return {
            selectBar: selectBar,
            deselectBar: deselectBar,
            getBarData: getBarData,
            createHorizontalLine: createHorizontalLine
        };

        // this.updateBar(settings.data);
        // return this;
    };

Chart.barChartLine = function(options) { //直方图柱状折线图结合
	var defaults = {
		selector: '',
		data: {}, // data
		group: '',
		colorRange: ["brown", "steelblue"],
		width: 960,
		height: 500,
		yAxisLabel: '',
		showLegend: false,
		horizontal: false,
		dimensionName: '',
		selectColor: "red",
		onClick: function() {},
	};

	// merge defaults and options,
	// overwriting any default setting specified in options
	var settings = $.extend({}, defaults, options);

	settings.data = $.extend(true, [], settings.data);

	var margin = {
			top: 20,
			right: 20,
			bottom: 30,
			left: 40
		},
		width = settings.width - margin.left - margin.right,
		height = settings.height - margin.top - margin.bottom;

	var x0 = d3.scale.linear().domain([-20, 20])
		.range([0, width]);

	var y = d3.scale.linear() //生成线性比例尺
		// .domain([-100,100])
		.range([height, 0]);

	var color = d3.scale.ordinal()
		.range(settings.colorRange);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"))
	// .ticks(10)//有几个刻度
	;

	var categoryNames = d3.keys(settings.data[0]).filter(function(key) {
		return key !== settings.dimensionName;
	});

	settings.data.forEach(function(d) {
		d.categories = categoryNames.map(function(name) {
			return {
				name: name,
				value: +d[name],
				num_sent: +d["num_sent"]
			};
		});
	});

	y.domain([0, d3.max(settings.data, function(d) {
		return d3.max(d.categories, function(d) {
			return d.value;
		});
	})]);

	var svg = d3.select(settings.selector).append("svg")
		.attr("class", "bar-chart")
		.attr("width", !settings.horizontal ? (width + margin.left + margin.right) : (height + margin.top + margin.bottom))
		.attr("height", !settings.horizontal ? (height + margin.top + margin.bottom) : (width + margin.left + margin.right))
		.append("g")
		.attr(
			"transform",
			"translate(" + (!settings.horizontal ? margin.left : (settings.height)) + "," + margin.top + ")" +
			(settings.horizontal ? " rotate(90)" : '')
		);

	var xAxisEl = svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	if (settings.horizontal) {
		xAxisEl
			.selectAll("text")
			.attr("transform", "rotate(-90)")
			.attr("x", "-13")
			.attr("y", "-3")
			.style("text-anchor", "end")
	}

	var yAxisEl = svg.append("g")
		.attr("class", "y axis")
		.call(yAxis).append("text")
		.text("数字")
		.attr("transform", "rotate(-90)") //text旋转-90°
		.attr("text-anchor", "end") //字体尾部对齐
		.attr("dy", "2em"); //沿y轴平移一个字体的大小

	yAxisEl.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(settings.yAxisLabel);

	if (settings.horizontal) {
		yAxisEl
			.selectAll("text")
			.attr("transform", "rotate(-90)")
			.attr("x", "0")
			.attr("y", "-13")
			.style("text-anchor", "middle")
	}

	// this.updateBar = function(chartData)
	// {
	// console.log("TRYING TO UPDATE");

	// every chart works with a copy of the data
	// chartData = $.extend(true, [], chartData);
	// console.log(settings.data);

	// console.log(chartData);

	// ===========================================================================
	var layer = svg.selectAll(".category")
		.data(settings.data);

	layer.exit().remove();

	var containers = layer.enter().append("g")
		.attr("class", "g") //每个柱子添加class
	// .attr("transform", function (d) {
	//         return "translate(" + width-x0(d[settings.dimensionName]) + ",0)";
	//     }
	// );


	//虚线图
	var data1 = [3, 4, 6, 3, 7, 8, 9, 7, 5, 3, 8];
	var chart_width = width - margin.left - margin.right;
	var chart_height = height - margin.top - margin.bottom
	var transfer_x = d3.scale.linear().domain([0, data1.length]).range([0, chart_width]),
		transfer_y = d3.scale.linear().domain([0, d3.max(data1)]).range([chart_height, 0]);

	var draw_line = d3.svg.line()
		.x(function(d, i) {
			return transfer_x(i);
		})
		.y(function(d) {
			return transfer_y(d);
		})
		.interpolate("cardinal");

	containers.append("svg:path")
		.attr("class", "area")
		.attr("d", draw_line(data1));
	///////////

	var bars = containers.selectAll("rect")
		// .data(function(d) { return d; })
		// .data(function(d) { d.categories = d.categories[0]; console.log(d); return d; })
		.data(function(d) {
			return d.categories;
		})

	bars.exit().remove();
	bars.enter().append("rect")
		.attr("width", 20)
		.attr("x", function(d) {
			return x0(d.num_sent);
		})
		.attr("y", function(d) {
			if (!isNaN(d.value)) return y(d.value);
		})
		.attr("height", function(d) {
			if (!isNaN(d.value)) {
				return height - y(d.value);
			}
		})
		.style("fill", function(d) {
			return 'yellow';
		});


	containers.on('click', function(d, i) {
		settings.onClick(d, i, this);
	});

	//背景横线
	// svg.selectAll(".y.axis")
	//     .selectAll(".tick line")
	//     .call(yAxis)
	//     .attr("x2", width);

	// legend
	if (settings.showLegend) {
		var arr = new Array();
		arr[0] = "样本";
		var legend = svg.selectAll(".legend")
			.data(arr.slice().reverse())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) {
				return "translate(0," + i * 20 + ")";
			});

		legend.append("rect")
			.attr("x", width - 18)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

		legend.append("text")
			.attr("x", width - 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(function(d) {
				return d;
			});
	}
	// };

	var getBarData = function(index) {
		var data = null;
		var bar = containers
			.filter(function(d, i) {
				return i === index;
			})
			.each(function(d) {
				data = d;
			});

		return data;
	};

	var selectBar = function(index) {
		var bar = containers
			.filter(function(d, i) {
				return i === index;
			})

		var classes = bar.attr("class");

		if (classes.indexOf("selected") < 0)
			bar.attr("class", classes + " selected");
		else
			return deselectBar(index);

		return true;
	};

	var deselectBar = function(index) {
		var bar = containers
			.filter(function(d, i) {
				return i === index;
			})

		var classes = bar.attr("class");

		if (classes.indexOf("selected") > 0)
			bar.attr("class", "g");
		else
			return selectBar(index);

		return false;

		// containers
		//   .filter(function(d,i){ return i === index; })
		//   .select("rect")
		//   .style("fill", "red");
	};


	var createVerticalLine = function(yPos, c) {
		var line = svg.append("g")
			.attr("transform", "translate(" + x0(yPos) + ", 0)")
			.append("line");

		line.attr("y2", height)
			.style("stroke", c)
			.style("stroke-width", "1px");
		if (c == 'red') {
			line.style("stroke-dasharray", "5,5") //虚线
		}
	};

	return {
		selectBar: selectBar,
		deselectBar: deselectBar,
		getBarData: getBarData,
		createVerticalLine: createVerticalLine
	};

	// this.updateBar(settings.data);
	// return this;
};

(function(root, factory) { //趋势图
	if (typeof define === 'function' && define.amd) {
		define(['d3'], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = function(d3) {
			return factory(d3);
		};
	} else {
		root.D3LineChart2 = factory(d3);
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
	var D3LineChart2 = function(element, options) {
		if (!element) return;

		// element
		this.element = element;

		// 기본 설정
		var defaultOptions = {
			unit: options.unit || null,
			legendName: options.legendName || 'name',
			valueName: options.valueName || 'value',
			//width: options.width || null,
			//height: options.height || null
		};

		// options
		this.options = defaultOptions;

		// initialize
		this.initialize();
	};
	D3LineChart2.prototype = {

		/**
		 * Initialize
		 */
		initialize: function() {

			// Node 정의
			var element = this.element;

			// 사이즈 구함
			var rect = getBoundingClientRect(element);

			// 사이즈 정의
			var margin = {
					top: 20,
					right: 20,
					bottom: 20,
					left: 40
				},
				/*width = this.options.width?this.options.width:this.width = rect.width - margin.left - margin.right,
				height = this.options.height?this.options.height:this.height = rect.height - margin.top - margin.bottom;*/
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
				.domain([-5, 5])
				.range([this.height, 0]);

			// X축 생성
			var xAxis = d3.svg.axis()
				.scale(xScale)
				.tickSize(0, 0)
				.tickPadding(10)
				.orient('bottom');

			// Y축 생성
			var yAxis = d3.svg.axis()
				.scale(yScale)
				// .ticks(5)
				// .tickPadding(7)
				// .tickSize(-this.width)//加上这行会添加上边框
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


			var createHorizontalLine = function(yPos, c) {
				let line = self.svg.append("g")
					.attr("transform", "translate(0, " + yScale(yPos) + ")")
					.append("line");
				line.attr("x2", self.width)
					.style("stroke", c)
					.style("stroke-width", "1px");

				if (c == 'blue') {
					line.style("stroke-dasharray", "5,5") //虚线
				}
			};

			createHorizontalLine(0, 'black');
			createHorizontalLine(1.2, 'blue');
		},

		/**
		 * 라인 그려 줌
		 * @param data Array 데이터 배열
		 */
		setLine: function(data) {
			var self = this,
				legendName = this.options.legendName,
				valueName = this.options.valueName,
				marginLeft = Math.round(self.xScale.rangeBand() / 2);

			// 라인을 셋팅함
			var valueLine = d3.svg.line()
				.x(function(d) {
					return self.xScale(d[legendName]) + marginLeft;
				})
				.y(function(d) {
					return self.yScale(d[valueName]);
				});
			this.svg.append('path')
				.attr('class', 'line')
				.attr("fill", "none")
				.attr("stroke", "#8080FF")
				.attr("stroke-width", "1") /*线条粗细*/
				.attr('d', valueLine(data));

			// 라벨 박스를 만듦
			var label = this.svg.selectAll('label')
				.data(data)
				.enter()
				.append('g')
				.attr('class', 'label');
			label.attr('transform', function(d) {
				return 'translate(' + (self.xScale(d[legendName]) + +marginLeft) + ',' +
					self.yScale(d[valueName]) + ')';
			});

			// 默认是圆形
			// label.append('circle')
			//     .attr("r", 4.5);


			//创建一个符号生成器
			var symbol = d3.svg.symbol()
				.size(function(d) {
					return d.size
				})
				.type(function(d) {
					return d.type
				});


			//添加菱形
			label.append('path')
				.attr("d", function(d) {
					var car = {
						size: "50",
						type: "diamond"
					};
					return symbol(car)
				})
				.attr("fill", function(d, i) {
					//点颜色
					return 'blue';
				});

			// 라인에 라벨을 만듦
			label.append("text")
				.attr("dy", -8)
				.text(function(d) {
					return d[self.options.valueName];
				})
		}
	};

	return D3LineChart2;
}));
