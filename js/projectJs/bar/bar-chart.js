// https://observablehq.com/@viveknair1997/bar-chart@648
export default function define1(runtime, observer) {
	const main = runtime.module();
	// 	main.variable(observer()).define(["md"], function(md) {
	// 		return (
	// 			md `# Bar Chart
	// 
	// This chart shows the relative frequency of letters in the English language. This is a vertical bar chart, also known as a *column* chart. Compare to a [horizontal bar chart](/@mbostock/d3-horizontal-bar-chart).`
	// 		)
	// 	});

	main.variable(observer("chart")).define("chart", ["d3", "width", "height", "xAxis", "yAxis", "data", "x", "y","margin"],
		function(d3, width, height, xAxis, yAxis, data, x, y,margin) {
			const svg = d3.create("svg").attr('preserveAspectRatio', 'xMaxYMax meet').attr("viewBox", [-20, -20, width + 50,
				height + 80
			])

			const xAxisG = svg.append("g")
				.call(xAxis);

			const yAxisG = svg.append("g")
				.call(yAxis);
			const theGraph1 = svg.selectAll(".yAxis").append("g").attr("class","green").attr("transform",function(d){
				// 标识线一
				const num = ((height-margin.top-margin.bottom)/10)*3+20.5+22.5
				return "translate(0,"+num+")"
				
			}).append("line").style("stroke","rgb(0,128,0)").attr("x2",width);
			
			const theGraph2 = svg.selectAll(".yAxis").append("g").attr("class","red").attr("transform",function(d){
				// 标识线二
				const num = ((height-margin.top-margin.bottom)/10)*6+20.5+22.5
				return "translate(0,"+num+")"
				
			}).append("line").style("stroke","rgb(255,0,0)").attr("x2",width);
			
			const text1 = svg.selectAll(".green").append("text").text("标识线一").attr("y", "-5")
			.attr("x", width-10).attr("dy", "0.32em").style("fill","green")
			
			const text2 = svg.selectAll(".red").append("text").text("标识线二").attr("y", "-5")
			.attr("x", width-10).attr("dy", "0.32em").style("fill","red")
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
				.style("stroke", function(d){
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
					return y(d.frequency) +20;
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

			return svg.node();
		}
	);
	main.variable().define("tooltip", ["d3"], function(d3) {
		return (
			d3.select('body').append('div')
			.attr('class', 'tooltip')
			.style('opacity', 0)
		)
	});
	main.variable().define("data", function() {
		return (
			[{
					"letter": "Monday",
					"frequency": 24,
				},
				{
					"letter": "Mond2ay",
					"frequency": 75,
				},
				{
					"letter": "Monda1y",
					"frequency": 50,
				},
				{
					"letter": "Tuesday",
					"frequency": 95,
				},
				{
					"letter": "Wednesday",
					"frequency": 36,
				},
				{
					"letter": "Thursday",
					"frequency": 42,
				},
				{
					"letter": "Friday",
					"frequency": 68,
				},
				{
					"letter": "Saturday",
					"frequency": 14,
				},
				{
					"letter": "Sunday",
					"frequency": 20,
				}
			]
		)
	});
	main.variable().define("x", ["d3", "data", "margin", "width"], function(d3, data, margin, width) {
		return (
			d3.scaleBand()
			.domain(data.map(d => d.letter))
			.range([margin.left, width - margin.right])
			.padding(0.5)
		)
	});
	main.variable().define("y", ["d3", "data", "height", "margin"], function(d3, data, height, margin) {
		return (
			d3.scaleLinear()
			.domain([0, d3.max(data, d => d.frequency)]).nice()
			.range([height - margin.bottom, margin.top])
		)
	});
	main.variable().define("xAxis", ["height", "margin", "d3", "x"], function(height, margin, d3, x) {
		return (
			g => g
			.attr("transform",function(){
				return `translate(0,${height - margin.bottom})`
			} )
			.call(d3.axisBottom(x).tickSizeOuter(0))
			.classed('xAxis', true)
		)
	});
	main.variable().define("yAxis", ["margin", "d3", "y", "width"], function(margin, d3, y, width) {
		return (
			g => g
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y).tickSize(-width).tickFormat(d3.format(",.2s")))
			.call(g => g.select(".domain").remove())
			.classed('yAxis', true)
		)
	});
	main.variable().define("height", function() {
		return (
			500
		)
	});
	main.variable().define("margin", function() {
		return ({
			top: 20,
			right: 0,
			bottom: 30,
			left: 40
		})
	});
	main.variable().define("d3", ["require"], function(require) {
		return (
			require("d3@4.13")
		)
	});
	return main;
}
