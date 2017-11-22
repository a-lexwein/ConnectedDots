// var data = [];
// //var maxCol = 2;
// for (var i = 0; i < 4; i++) {
//   for (var j = 0; j < 4; j++) {
//     data.push({'x':i,'y':j})
//   }
// }
//
// var data = [
// {x: 0, y: 0, text: 's'},
// {x: 0, y: 1, text: 't'},
// {x: 0, y: 2, text: 'p'},
//
// {x: 1, y: 0, text: 'e'},
// {x: 1, y: 1, text: 'a'},
// {x: 1, y: 2, text: 'o'},
//
// {x: 2, y: 0, text: 'x'},
// {x: 2, y: 1, text: 'g'},
// {x: 2, y: 2, text: 't'}
// ]

//https://stackoverflow.com/questions/19269545/how-to-get-n-no-elements-randomly-from-an-array
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
    }
    return result;
}


var wordLength = 6
var words = getRandom(ospd.filter(x => x.length === wordLength),4)

words1 = words.map(function(x) {
  return [x.slice(0,2), x.slice(2,4), x.slice(4,6)]
})

words1 = _.unzip(words1)

data = []
for (var i = 0; i < words1.length; i++) {
  var arr = _.shuffle(words1[i]);
  for (var j = 0; j < arr.length; j++) {
    var node = {x: i, y: j, text: arr[j]};
    data.push(node)
  }
}



var maxCol =  Math.max(...data.map(point => point.x))
var maxGuess =  Math.max(...data.map(point => point.y))


var colors = ['red', 'green', 'blue', 'pink']
var colorIndex = 0;
var guess2 = '';

var activeCol = -1;
var guessCount = 0;
var lastClick = {x: 0, y:0};
var clicks = [lastClick];

var a = window
var w = a.innerWidth;
var h = a.innerHeight * 2/3;



var xValue = function(d) { return d.x;}, // data -> value
    xScale = d3.scale.linear().range([0, w]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    yValue = function(d) { return d.y;}, // data -> value
    yScale = d3.scale.linear().range([h, 0]),
    yMap = function(d) { return yScale(yValue(d));}; // data -> display


// don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

var svg = d3.select("#main").append("svg").attr({
  width: w,
  height: h
});

svg.selectAll(".dot")
   .data(data)
   .enter().append("circle")
   .attr("class", "dot")
   .attr("r", 25)
   .attr("cx", xMap)
   .attr("cy", yMap)
   .attr("col", xValue)
   .attr('text', x => x.text)
   .attr('used', false)

svg.selectAll(".text")
   .data(data)
   .enter().append("text")
   .attr("class", "text")
   .attr("x", xMap)
   .attr("y", yMap)
   .style('fill', 'darkOrange')
   .text(x => x.text)

function connectDots(a,b) {
  svg.append('line')
      .attr({
         x1: a.x,
         y1: a.y,
         x2: b.x,
         y2: b.y,
         stroke: colors[colorIndex%colors.length]
       })
}

function removeLastLine() {
  $("line").last().remove()
  activeCol --;
}

svg.selectAll(".dot").on("click", function() {
  var click = {
    x:d3.select(this).attr('cx'),
    y:d3.select(this).attr('cy'),
    col:Number(d3.select(this).attr('col')),
    text: d3.select(this).attr('text'),
    used: d3.select(this).attr('used')
  }
  clicks.unshift(click);

  if (click.col === activeCol + 1 & click.used === "false") {
    d3.select(this).style('stroke',colors[colorIndex%colors.length])
    var guess = $('#guess').text()
    $('#guess').text(guess + click.text)
    guess2 = guess2 + click.text;
    d3.select(this).attr('used', "true");

    if (click.col === 0) {
      lastClick = click
      activeCol ++
    } else {

    connectDots(lastClick, click);
    activeCol ++;
    lastClick = click;



  if (activeCol === maxCol) {
    activeCol = -1;
    var guess = $('#guess').text()
    $('#guess').text(guess + '\n')
    $('#guess2').append('<li style="color:'+colors[colorIndex%colors.length]+';">'+guess2+'</li>')
    guess2 = ''
    guessCount++
    colorIndex ++;
  }
}

}
if (guessCount > maxGuess) {
  var result = checkList() ? 'CORRECT!' : 'WRONG!'
    svg.append("text")
      .attr("x", 150)
      .attr("y", 150)
      .attr("text-anchor", "middle")
      .style("font-size", "40px")
      .style("text-decoration", "underline")
      .text(result);
}
});

var check = function(word) {
  return ospd.indexOf(word) !== -1;
}

var checkList = function() {
  var arr = $('li').map(function() {
    return $(this).text();
  }).get();
  return arr.every(check);
}
