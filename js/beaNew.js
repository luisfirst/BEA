


$(document).ready(function(){
	
	menuBuilder();
		
	choiceMade();
	
});



function menuBuilder() {
	
	$.ajax({
		
					url: getURI()+getKey()+getMethod(0)+getSetName(0)+getParName(0)+getFormat(),
					
					data: {},
					
					type: "GET",
					
					dataType: "json",
					
					success: function(json) {
						//console.log(json);
						loadMenu(json);

					}
					
				});
}

function getParName(choice) {
	
	switch (choice) {
		case 0:
			return "ParameterName=TableID&";
			break;
		case 1:
			return "ParameterName=Frequency&";
			break;
			
		case 2:
			return "ParameterName=Year&";
			break;
			
		case 3:
			return "ParameterName=Industry&";
			break;
		default:
	}
	
}

function getSetName(option) {
	
	switch (option) {
		case 0:
			return "DataSetName=GDPbyIndustry&";
			break;
		case 1:
			return "&";
			break;
			
		case 2:
			return "&";
			break;
			
		case 3:
			return "&";
			break;
		default:
	}
	
}

function getURI() {
	
	return "http://www.bea.gov/api/data/?&"
}

function getKey() {
	
	return "UserID=C854A2E7-4ABC-4BBB-BAAD-FA9A9119D72A&";
}

function getMethod(choice) {
	
		switch (choice) {
		case 0:
			return "method=GetParameterValues&";
			break;
		case 1:
			return "method=GetParameterValuesFiltered&";
			break;
			
		case 2:
			return "method=getparameterlist&";
			break;
			
		case 3:
			return "method=GETDATASETLIST&";
			break;
			
		case 4:
			return "method=GetData&";
		default:
	}
	
	
}

function getFormat() {
	
	return "ResultFormat=JSON&";
}

function loadMenu(data) {
	
	//var temp = document.getElementById("choicemenu");
	var temp = document.createElement("Select");
	
	//temp = new Select({el: $('.choicemenu'), alignToHighlighted: 'always'});
			
	
	/*
	var first = document.createElement("option");
	first.text =  "Choose One:";
	temp.appendChild(first);
	
	
	var morelement = document.createElement("option");	
	morelement.text = "Real Value Added by Industry (2007)";
	morelement.value = "http://www.bea.gov/api/data/?&UserID=C854A2E7-4ABC-4BBB-BAAD-FA9A9119D72A&method=GetData&DataSetName=GDPbyIndustry&Year=2007&Industry=ALL&tableID=10&Frequency=A&ResultFormat=JSON&";
	
	morelement.value = "http://www.bea.gov/api/data/?&UserID=C854A2E7-4ABC-4BBB-BAAD-FA9A9119D72A&method=GetData&DataSetName=GDPbyIndustry&Year=ALL&Industry=ALL&tableID=10&Frequency=A&ResultFormat=JSON&";
	temp.appendChild(morelement);
	
	*/
	temp.multiple = true;
	
	var arraydata = data.BEAAPI.Results.ParamValue;

	
	var fieldcount = arraydata.length;
	
	temp.size = 5;
	
	var morelement = document.createElement("option");

	morelement.value = "ALL";
	morelement.text = "All";
	
	temp.appendChild(morelement);
	
	for (var i = 0; i < fieldcount; i=i+1) {
		var newelement = document.createElement("option");
		
		newelement.value = arraydata[i].Key;
		var now = arraydata[i].Descr;
		
		if (now == undefined) {
			newelement.text = arraydata[i].Desc;
		}
		else {
			newelement.text = now;
		}
		
		
		if (i == 0 || i == 11 || i == 16 || i == 21) {
			
			var menugroup = document.createElement("OPTGROUP");
			
			if (i != 21) {
				
				menugroup.setAttribute("label", newelement.text);
			}
			else {
				menugroup.setAttribute("label", "KLEMS");
			}
			
		}
		
		if (i == 10 || i == 15 || i == 20 || i== 37) {
			temp.appendChild(menugroup);
		}
		else{
			
			menugroup.appendChild(newelement);
		}
		
	}
	
	var current = document.getElementById("usermenus");
	var curr2 = document.getElementById("footer");

	//current.insertBefore(temp, curr2);
	document.getElementById("footerblock").insertBefore(temp, curr2);

}

function choiceMade() {
	
	
	$("#choicemenu").on("change", function(event) {
		
		//document.getElementById("r2").innerHTML = "Howdy!";					
			
			
			var current = document.getElementById("choicemenu").value;
			
			
			var data = $.ajax({
		
					url: current,
					
					data: {},
					
					type: "GET",
					
					dataType: "json",
					
					success: function(json) {
						//console.log("Howdy!");
						//dataFill(json);
						consoleOut(json);
						
						
					}
					
				});
			

	
	});
}

function plotter(jason3, data) {
		var margin = {top: 40, right: 10, bottom: 10, left: 10},
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		var color = d3.scale.category20c();

		var treemap = d3.layout.treemap()
			.size([width, height])
			.sticky(true)
			.value(function(d) { 
			
			for (var count = 0; count < data.length; count++) {
				
				if (data[count].IndustrYDescription == d.name) {
					
					d.value = data[count].DataValue;
					break;
				}
				
			}
			
			//console.log("d.value");
			//console.log(d.value);
			//console.log("d.name");
			//console.log(d.name);
			
			return d.value; });

		var div = d3.select("body").append("div")
			.style("position", "relative")
			.style("width", (width + margin.left + margin.right) + "px")
			.style("height", (height + margin.top + margin.bottom) + "px")
			.style("left", margin.left + "px")
			.style("top", margin.top + "px");

		d3.json("dataStructure.json", function(error, root) {
		  if (error) throw error;

		  //console.log("root");
		 // console.log(root);
		  var node = div.datum(root).selectAll(".node")
			  .data(treemap.nodes)
			.enter().append("div")
			  .attr("class", "node")
			  .call(position)
			  .style("background", function(d) { return d.children ? color(d.name) : null; })
			  .text(function(d) { return d.children ? null : d.name; });

});

		function position() {
		  this.style("left", function(d) { return d.x + "px"; })
			  .style("top", function(d) { return d.y + "px"; })
			  .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
			  .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
		}
	
}



function dataFill(json2) {
	
	var arraydata = json2.BEAAPI.Results.Data;
	

	
	//console.log("arraydata");
	//console.log(arraydata);
	
	plotter(json2, arraydata);
}

// Test code
function consoleOut(contents) {
	
	console.log("Begin console out");
	//console.log(contents);
	console.log("contents.BEAAPI: ");
	console.log(contents.BEAAPI);
	//console.log(contents.BEAAPI.Request);
	console.log("RequestParam: ");
	console.log(contents.BEAAPI.Request.RequestParam);
	//console.log(contents.BEAAPI.Request.RequestParam[1]);
	//console.log(contents.BEAAPI.Request.RequestParam[1].ParameterName);
	
	console.log("Results");
	//console.log(contents.BEAAPI.Results);
	//console.log(contents.BEAAPI.Results.ParamValue);
	console.log("Data");
	console.log(contents.BEAAPI.Results.Data);
	
	//console.log("example");
	//console.log(contents.BEAAPI.Results.Data[2].DataValue);
	console.log("end console out");
}