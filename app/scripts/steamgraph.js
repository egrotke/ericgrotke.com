function streamgraph() {
    var _chart = {};

    var _width = 900, _height = 450,
            _margins = {top: 0, left: 40, right: 40, bottom: 120},
            _x, _y,
            _data = [],
            _colors = d3.scale.category20(),
            _svg,
            _bodyG,
            _line;

    _chart.render = function () {
        if (!_svg) {
            _svg = d3.select('#graph').append('svg')
                    .attr('height', _height)
                    .attr('width', _width);

            renderAxes(_svg);

            defineBodyClip(_svg);
        }

        renderBody(_svg);
    };

    function renderAxes(svg) {
        var axesG = svg.append('g')
                .attr('class', 'axes');

        renderXAxis(axesG);

        renderYAxis(axesG);
    }

    function renderXAxis(axesG) {
        var xAxis = d3.svg.axis()
                .scale(_x.range([0, quadrantWidth()]))
                .orient('bottom');

        axesG.append('g')
                .attr('class', 'x axis')
                .attr('transform', function () {
                    return 'translate(' + xStart() + ',' + (yStart() + 50) + ')';
                })
                .call(xAxis);
    }

    function renderYAxis(axesG) {
        var yAxis = d3.svg.axis()
                .scale(_y.range([quadrantHeight(), 0]))
                .orient('left');
    }

    function defineBodyClip(svg) {
        var padding = 5;

        svg.append('defs')
                .append('clipPath')
                .attr('id', 'body-clip')
                .append('rect')
                .attr('x', 0 - padding)
                .attr('y', 0)
                .attr('width', quadrantWidth() + 2 * padding)
                .attr('height', quadrantHeight());
    }

    function renderBody(svg) {
        if (!_bodyG)
            _bodyG = svg.append('g')
                    .attr('class', 'body')
                    .attr('transform', 'translate('
                            + xStart() + ','
                            + yEnd() + ')')
                    .attr('clip-path', 'url(#body-clip)');

        var stack = d3.layout.stack()
                .offset('wiggle');
        var stackedData = stack(_data);

        renderAreas(stackedData);
    }

    function renderAreas(stackedData) {
        var area = d3.svg.area()
                .interpolate('cardinal')
                .x(function (d) {
                    return _x(d.x);
                })
                .y0(function(d){return _y(d.y0);})
                .y1(function (d) {
                    return _y(d.y + d.y0);
                });
        var someColors = d3.scale.category20();

        _bodyG.selectAll('path.area')
                .data(stackedData)
                .enter()
                .append('path')
                .style('fill', function (d, i) {
                    
                    var seed = Math.floor(Math.random()*100%20);
                    // console.log(seed + ' : ' + someColors.range()[seed] );
                    return someColors.range()[seed];
                })
                .attr('class', 'area');

        _bodyG.selectAll('path.area')
                .data(_data)
                .transition()
                .attr('d', function (d) {
                    return area(d);
                });
    }

    function xStart() {
        return _margins.left;
    }

    function yStart() {
        return _height - _margins.bottom;
    }

    function xEnd() {
        return _width - _margins.right;
    }

    function yEnd() {
        return _margins.top;
    }

    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }

    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) { 
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };

    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };

    _chart.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _chart;
    };

    _chart.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _chart;
    };

    _chart.addSeries = function (series) {
        _data.push(series);
        return _chart;
    };

    return _chart;
}

function randomData() {
    return Math.random() * 6;
}




