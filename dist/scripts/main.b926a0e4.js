"use strict";function streamgraph(){function a(a){var d=a.append("g").attr("class","axes");b(d),c(d)}function b(a){var b=d3.svg.axis().scale(l.range([0,j()])).orient("bottom");a.append("g").attr("class","x axis").attr("transform",function(){return"translate("+g()+","+(h()+50)+")"}).call(b)}function c(){d3.svg.axis().scale(m.range([k(),0])).orient("left")}function d(a){var b=5;a.append("defs").append("clipPath").attr("id","body-clip").append("rect").attr("x",0-b).attr("y",0).attr("width",j()+2*b).attr("height",k())}function e(a){o||(o=a.append("g").attr("class","body").attr("transform","translate("+g()+","+i()+")").attr("clip-path","url(#body-clip)"));var b=d3.layout.stack().offset("wiggle"),c=b(t);f(c)}function f(a){var b=d3.svg.area().interpolate("cardinal").x(function(a){return l(a.x)}).y0(function(a){return m(a.y0)}).y1(function(a){return m(a.y+a.y0)}),c=d3.scale.category20();o.selectAll("path.area").data(a).enter().append("path").style("fill",function(){var a=Math.floor(100*Math.random()%20);return c.range()[a]}).attr("class","area"),o.selectAll("path.area").data(t).transition().duration(400).attr("d",function(a){return b(a)})}function g(){return s.left}function h(){return r-s.bottom}function i(){return s.top}function j(){return q-s.left-s.right}function k(){return r-s.top-s.bottom}var l,m,n,o,p={},q=900,r=450,s={top:0,left:40,right:40,bottom:120},t=[],u=d3.scale.category20();return p.render=function(){n||(n=d3.select("#graph").append("svg").attr("height",r).attr("width",q),a(n),d(n)),e(n)},p.width=function(a){return arguments.length?(q=a,p):q},p.height=function(a){return arguments.length?(r=a,p):r},p.margins=function(a){return arguments.length?(s=a,p):s},p.colors=function(a){return arguments.length?(u=a,p):u},p.x=function(a){return arguments.length?(l=a,p):l},p.y=function(a){return arguments.length?(m=a,p):m},p.addSeries=function(a){return t.push(a),p},p}var app=angular.module("egApp",["ngRoute"]);app.config(["$routeProvider",function(a){a.when("/home",{templateUrl:"pages/home.html",reloadOnSearch:!1}).when("/about",{templateUrl:"pages/about.html",reloadOnSearch:!1}).when("/contact",{templateUrl:"pages/contact.html",reloadOnSearch:!1}).when("/streamgraph",{templateUrl:"pages/streamgraph.html",controller:"StreamController",reloadOnSearch:!1}).when("/piechart",{templateUrl:"pages/piechart.html",controller:"PieChartController",reloadOnSearch:!1}).when("/projects",{templateUrl:"pages/projects.html",reloadOnSearch:!1}).when("/tags",{templateUrl:"pages/tags.html",controller:"TagsController",reloadOnSearch:!1}).when("/stylesheet",{templateUrl:"pages/stylesheet.html",reloadOnSearch:!1})}]),app.controller("LettersController",["$rootScope","$scope","$location","SiteData",function(a,b,c,d){b.timeouts=[],b.myData={},d.letters().then(function(a){b.myData.words=a.data,b.doStuffWithData()},function(a,b){console.log("Error: didnnt get JSON"+a+b)}),b.doStuffWithData=function(){b.template=b.myData.words[0],b.myData.words.doClick=function(c,d){b.action=d.action,"drawGraph"===b.action&&a.$emit("loadStream"),"piechart"===b.action&&a.$emit("loadPie"),a.emailSelected="email"===b.action?"selected":"",a.linkedInSelected="linkedin"===b.action?"selected":"",a.githubSelected="github"===b.action?"selected":"",a.resumeSelected="resume"===b.action?"selected":""},b.myData.words.doHover=function(c,d,e){e.stopPropagation(),"drawGraph"===b.action&&a.$emit("updateStream"),"piechart"===b.action&&a.$emit("updatePie")}};var e=function(a,c){angular.forEach(angular.element(".flip-container"),function(d,e){var f=angular.element(d);f.hasClass("hover")&&f.removeClass("hover"),clearTimeout(b.timeouts[e]),e>=a&&c>e&&(b.timeouts[e]=setTimeout(function(){f.addClass("hover")},150*(e-a)+200))})};b.getClass=function(a){return c.path()?c.path().substr(1,a.length)===a?"":"selected":"home"===a?"selected":void 0},a.getScrolled=function(){return a.scrolled},window.onscroll=function(){var b=12;"scrolled"!==a.scrolled&&document.body.scrollTop>200?(a.$apply(function(){a.scrolled="scrolled"}),window.innerWidth<768&&(b=0)):"midscroll"!==a.scrolled&&document.body.scrollTop>20&&document.body.scrollTop<200?(a.$apply(function(){a.scrolled="midscroll"}),window.innerWidth<768&&(b=0)):a.scrolled&&document.body.scrollTop<20&&(a.$apply(function(){a.scrolled=""}),b=0),e(0,b)},b.getFlipperPos=function(){return a.scrolled?a.scrolled:"/home"===c.path()||""===c.path()?"":"subPage"},b.$on("$routeChangeSuccess",function(a,c){b.transitionState="active",c&&"pages/streamgraph.html"!==c.loadedTemplateUrl&&(d3.select("svg").remove(),b.streamData=0),c&&"pages/home.html"===c.loadedTemplateUrl?e(0,0):c&&"pages/contact.html"===c.loadedTemplateUrl?e(0,4):c&&"pages/about.html"===c.loadedTemplateUrl?e(0,0):c&&"pages/projects.html"===c.loadedTemplateUrl&&e(4,12)})}]),app.controller("StreamController",["$rootScope","$scope","$timeout",function(a,b,c){var d=function(){var a=Math.floor(10*Math.random())+4;b.numberOfDataPoint=Math.floor(51*Math.random())+5,d3.select("svg").remove(),b.streamData=[];for(var d=0;a>d;++d)b.streamData.push(d3.range(b.numberOfDataPoint).map(function(a){return{x:a,y:0===a||a===b.numberOfDataPoint-1?0:b.randomData()}}));b.chart=streamgraph().x(d3.scale.linear().domain([0,b.numberOfDataPoint-1])).y(d3.scale.linear().domain([0,65])).colors(d3.scale.linear().range(["#aad","#556"])),b.streamData.forEach(function(a){b.chart.addSeries(a)}),b.chart.render(),c(function(){e()},.4);var f=0,g=setInterval(function(){e(),1===++f&&window.clearInterval(g)},400)},e=function(){for(var a=0;a<b.streamData.length;++a){var c=b.streamData[a];c.length=0;for(var d=0;d<b.numberOfDataPoint;++d)c.push({x:d,y:0===d||d===b.numberOfDataPoint-1?0:b.randomData()})}b.chart.render()};b.$on("$routeChangeSuccess",function(){b.transitionState="active",b.streamData=0,d()}),a.$on("loadStream",function(){d()}),a.$on("updateStream",function(){b.streamData&&e()}),b.randomData=function(){return 6*Math.random()}}]),app.controller("PieChartController",["$rootScope","$scope","$http","$timeout","Pie",function(a,b,c,d,e){var f=!1;d(function(){f=e.newChart(9*Math.random()+1)},1),a.$on("loadPie",function(){f=e.newChart(9*Math.random()+1)}),a.$on("updatePie",function(){f&&e.update()})}]),app.controller("TagsController",["$rootScope","$scope","SiteData",function(a,b,c){function d(a,b){this.key=a,this.value=b}function e(b){var c=$(".words");a.wordOBJ=[],$(".words svg").remove(),c.removeClass("short medium long longer"),b.length>200?c.addClass("longer"):b.length>100?c.addClass("long"):b.length>50?c.addClass("medium"):c.addClass("short"),b.split("").forEach(function(b,c){a.wordOBJ.push(new d(c,b))})}c.tags().then(function(a){b.tagData=a.data;var c=Math.floor(Math.random()*b.tagData.length),d=b.tagData[c];e(d.description?d.description:d.name)},function(a,b){console.log("Error: didnnt get JSON"+a+b)}),b.changeWord=function(a){e(a.description?a.description:a.name)}}]),app.directive("letter",["$compile","$http","$templateCache",function(a,b,c){var d="",e=function(a){var e,f="svg/",g="abcdefghijklmnopqrstuvwxyz1234567890(){}=+;<>-$*";return a=a.toLowerCase(),d?(d+=a,";"===a?(f+="&br;"===d?"break.svg":"&tb;"===d?"tab.svg":"break.svg",d=""):f+="nada.svg"):g.indexOf(a)>-1?f+=a+".svg":"/"===a?f+="slash.svg":":"===a?f+="colon.svg":"."===a?f+="dot.svg":"'"===a?f+="quote.svg":"&"===a?(d+=a,f+="nada.svg"):f+="blank.svg",e=b.get(f,{cache:c})},f=function(b,c){var d=e(b.myletter.value);d.success(function(a){c.html(a)}).then(function(){c.replaceWith(a(c.html())(b))})};return{scope:{myletter:"="},link:f}}]),app.controller("ProjectsController",["$scope","SiteData",function(a,b){a.projectsData={},b.projects().then(function(b){a.projectsData.sites=b.data},function(a,b){console.log("Error: didnnt get JSON"+a+b)}),a.projectPics=function(){var a=[];return $("#pics img").each(function(b){a[b]=$(this).attr("src")}),a},a.getImage=function(b,c){return a.projectPics()[c]?a.projectPics()[c]:b.thumbnail?b.thumbnail:""}}]),app.factory("SiteData",["$http",function(a){return{letters:function(){return a.get("json/eg.json")},projects:function(){return a.get("json/projects.json")},tags:function(){return a.get("json/tags.json")}}}]),app.factory("Pie",function(){function a(){function a(a,b){f||(f=a.append("g").attr("class","body"));for(var c=0;b>c;c++)d(50*c,0)}function b(a,b){var c=g.selectAll("path.arc").data(a(k));c.enter().append("path").attr("class","arc").attr("fill",function(){var a=Math.floor(100*Math.random()%20);return l.range()[a]}),c.transition().attrTween("d",function(a){var c=this.__current__;c||(c={startAngle:0,endAngle:0});var d=d3.interpolate(c,a);return this.__current__=d(1),function(a){return b(d(a))}})}function c(a,b){var c=g.selectAll("text.label").data(a(k));c.enter().append("text").attr("class","label"),c.transition().attr("transform",function(a){return"translate("+b.centroid(a)+")"}).attr("dy",".35em").attr("text-anchor","middle").text(function(a){return a.data.id})}function d(a){var d=d3.layout.pie().sort(function(a){return a.id}).value(function(a){return a.value}),e=90*Math.abs(Math.sin(a))+a/30,h=m+e,k=n+e,l=d3.svg.arc().outerRadius(h).innerRadius(k),o=i/6+a/2,p=j/2-30;g=f.append("g").attr("class","pie").attr("transform-origin","left").attr("transform","translate("+o+","+p+")"),b(d,l),c(d,l)}var e,f,g,h={},i=1200,j=600,k=[],l=d3.scale.category20b(),m=200,n=100;return h.render=function(b){e||(e=d3.select("#pie-chart").append("svg").attr("height",j).attr("width",i)),a(e,b)},h.update=function(a){for(var b=0;a>b;b++)d(b,100*b)},h.width=function(a){return arguments.length?(i=a,h):i},h.height=function(a){return arguments.length?(j=a,h):j},h.colors=function(a){return arguments.length?(l=a,h):l},h.radius=function(a){return arguments.length?(m=a,h):m},h.innerRadius=function(a){return arguments.length?(n=a,h):n},h.data=function(a){return arguments.length?(k=a,h):k},h}var b,c,d=function(){return 9*Math.random()+1},e={};return e.update=function(){},e.newChart=function(e){var f=4*Math.random()+4,g=50*Math.random()+10;return d3.select("svg").remove(),b=d3.range(e).map(function(a){return{id:a,value:d()}}),c=a().radius(g+f).innerRadius(g).data(b),c.render(10*Math.random()+20),!0},e});