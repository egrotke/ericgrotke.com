'use strict';

app.factory('PieService', function() {

    function pieChart() {
        var _chart = {};

        var _width = 1200,
            _height = 600,
            _data = [],
            _colors = d3.scale.category20b(),
            _svg,
            _bodyG,
            _pieG,
            _radius = 200,
            _innerRadius = 100;

        _chart.render = function(num) {
            if (!_svg) {
                _svg = d3.select('#pie-chart').append('svg')
                    .attr('height', _height)
                    .attr('width', _width);
            }
            renderBody(_svg, num);
        };

        _chart.update = function(num) {
            for (var i = 0; i < num; i++) {
                renderPie(i, i * 100);
            }
        };

        function renderBody(svg, num) {
            if (!_bodyG) {
                _bodyG = svg.append('g')
                    .attr('class', 'body');
            }
            for (var i = 0; i < num; i++) {
                renderPie(i * 50, 0);
            }
        }

        function renderPie(i) {
            var pie = d3.layout.pie() // <-A
                .sort(function(d) {
                    return d.id;
                })
                .value(function(d) {
                    return d.value;
                });

            var spread = Math.abs(Math.sin(i)) * 90 + i / 30;
            // var spread = Math.abs(Math.cos(i))*90 + i/30;
            var thisRadius = _radius + spread;
            var thisInnerRadius = _innerRadius + spread;

            var arc = d3.svg.arc()
                .outerRadius(thisRadius)
                .innerRadius(thisInnerRadius);

            var xPos = _width / 6 + i / 2,
                yPos = _height / 2 - 30;
                // rotation = x + 'deg';

            // if (!_pieG)
            _pieG = _bodyG.append('g')
                .attr('class', 'pie')
                .attr('transform-origin', 'left')
                .attr('transform', 'translate(' +
                    xPos +
                    ',' +
                    yPos + ')');
            // + ' rotateY('
            // + rotation + ')' );

            renderSlices(pie, arc);

            renderLabels(pie, arc);
        }

        function renderSlices(pie, arc) {
            var slices = _pieG.selectAll('path.arc')
                .data(pie(_data));

            slices.enter()
                .append('path')
                .attr('class', 'arc')
                .attr('fill', function() {
                    var seed = Math.floor(Math.random() * 100 % 20);
                    return _colors.range()[seed];
                });

            slices.transition()
                .attrTween('d', function(d) {
                    var currentArc = this.__current__;

                    if (!currentArc) {
                        currentArc = {
                            startAngle: 0,
                            endAngle: 0
                        };
                    }

                    var interpolate = d3.interpolate(
                        currentArc, d);

                    this.__current__ = interpolate(1);

                    return function(t) {
                        return arc(interpolate(t));
                    };
                });
        }

        function renderLabels(pie, arc) {
            var labels = _pieG.selectAll('text.label')
                .data(pie(_data));

            labels.enter()
                .append('text')
                .attr('class', 'label');

            labels.transition()
                .attr('transform', function(d) {
                    return 'translate(' +
                        arc.centroid(d) + ')';
                })
                .attr('dy', '.35em')
                .attr('text-anchor', 'middle')
                .text(function(d) {
                    return d.data.id;
                });
        }

        _chart.width = function(w) {
            if (!arguments.length) {
                return _width; 
            }
            _width = w;
            return _chart;
        };

        _chart.height = function(h) {
            if (!arguments.length) {
                return _height; 
            }
            _height = h;
            return _chart;
        };

        _chart.colors = function(c) {
            if (!arguments.length) {
                return _colors; 
            }
            _colors = c;
            return _chart;
        };

        _chart.radius = function(r) {
            if (!arguments.length) {
                return _radius; 
            }
            _radius = r;
            return _chart;
        };

        _chart.innerRadius = function(r) {
            if (!arguments.length) {
                return _innerRadius; 
            }
            _innerRadius = r;
            return _chart;
        };

        _chart.data = function(d) {
            if (!arguments.length) { 
                return _data;
            }
            _data = d;
            return _chart;
        };


        return _chart;
    }

    var randomData = function() {
        return Math.random() * 9 + 1;
    };

    var pieFactory = {};
    var data, chart;

    pieFactory.update = function() {
        // for (var j = 0; j < data.length; ++j)
        //     data[j].value = randomData();

        // chart.update(10 * Math.random() + 20);
    };

    pieFactory.newChart = function(points) {

        var bandWidth = Math.random() * 4 + 4,
            innerWidth = Math.random() * 50 + 10;

        d3.select('svg').remove();

        data = d3.range(points).map(function(i) {
            return { id: i, value: randomData() };
        });

        chart = pieChart()
            .radius(innerWidth + bandWidth)
            .innerRadius(innerWidth)
            .data(data);

        chart.render(10 * Math.random() + 20);

        return true;
    };

    return pieFactory;
});
