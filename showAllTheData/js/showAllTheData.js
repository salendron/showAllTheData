/**
 * @author salendron
 */

function ShowAllTheData(){
	var m_dataunits = new Array();
	
	this.getDataUnits = getDataUnits;
	this.addDataUnit = addDataUnit;
	
	this.generateColorsBetween = generateColorsBetween;
	
	this.countCharacteristicGroupedByValue = countCharacteristicGroupedByValue;
	
	//drawfunction
	this.drawDataAreasForCharacteristic = drawDataAreasForCharacteristic;
	
	function getDataUnits(){
		return m_dataunits;
	}
	
	function addDataUnit(newDataUnit){
		m_dataunits.push(newDataUnit);
	}
	
	function countCharacteristicGroupedByValue(characteristicName, inPercent){
		var groups = new Array();
		
		for(var i = 0; i < m_dataunits.length; i++){
			var c = m_dataunits[i].getCharacteristicByName(characteristicName);
			if(c != null){
				var idx = indexOfGroup(c.getValue(), groups);
				if(idx != -1){
					groups[idx][1]++;
				} else {
					var group = new Array();
					group[0] = c.getValue();
					group[1] = 1;
					groups.push(group);
				}
			}
		}
		
		if(inPercent){
			for(var i = 0; i < groups.length; i++){
				groups[i][1] = groups[i][1] / (m_dataunits.length / 100.0);
			}
		}
		
		return groups;
	}
	
	function cleanSmallGroups(groups,groupspc){
		var retGroups = new Array();
		var retGroupsPc = new Array();
		
		for(var i = 0; i < groups.length; i++){
			var gName = groups[i][0];
			if(groupspc[i][1] < 0.8){
				gName = "other";
			}
			
			var idx = indexOfGroup(gName, retGroups);
			if(idx != -1){
				retGroups[idx][1] += groups[i][1];
				retGroupsPc[idx][1] += groupspc[i][1];
			} else {
				var g = new Array();
				g[0] = gName;
				g[1] = groups[i][1];
				retGroups.push(g);
				
				var g1 = new Array();
				g1[0] = gName;
				g1[1] = groupspc[i][1];
				retGroupsPc.push(g1);
			}
		}
		
		return [retGroups,retGroupsPc];
	}
	
	function indexOfGroup(groupName, groups){
		for (var i = 0; i < groups.length; i++){
			if(groups[i][0] == groupName){
				return i;
			}
		}
		return -1;
	}
	
	function compareGroupValue(a,b) {
		if (a[1] < b[1])
			return -1;
		if (a[1] > b[1])
			return 1;
		return 0;
	}
	
	function generateColorsBetween(quantity,r1,g1,b1,r2,g2,b2){
		rStep = (r2 - r1) / quantity;
		gStep = (g2 - g1) / quantity;
		bStep = (b2 - b1) / quantity;
		
		colors = new Array();
		
		for(var i = 0; i < quantity; i++){
			colors.push("rgb(" 
							+ (r1 + Math.round(rStep * i)) + ","
							+ (g1 + Math.round(gStep * i)) + ","
							+ (b1 + Math.round(bStep * i)) + ")");
		}
		
		return colors;
	}
	
	function drawDataAreasForCharacteristic(canvas, characteristicName, inPercent, bgcolor, colors){
		var container = document.getElementById(canvas);
		
		//getSize
		var width = container.width;
		var height= container.height;
		
		//get size of 1 percent
		var onePc = (height * width) / 100.0;
		
		//drawing context
		var context = container.getContext("2d");

		//background
		context.clearRect(0,0,width,height);
		context.fillStyle = bgcolor;
 		context.fillRect(0,0,width,height);
 		
 		//get data as we need it 
 		var groups = countCharacteristicGroupedByValue(characteristicName, inPercent);
 		groups = groups.sort(compareGroupValue).reverse();
 		
 		//get data in percent
 		var groupsInPc = countCharacteristicGroupedByValue(characteristicName, true);
 		groupsInPc = groupsInPc.sort(compareGroupValue).reverse();
 		
 		var cleanGroups = cleanSmallGroups(groups,groupsInPc);
 		groups = cleanGroups[0];
 		groupsInPc = cleanGroups[1];
 		
 		colors = generateColorsBetween(groupsInPc.length,254,237,1,187,204,1);
 		
 		//draw
 		var vertical = false;
 		
 		//origin
 		var x = 0;
 		var y = 0;
 		
 		//drawing height and width
 		var dh = 0;
 		var dw = 0;
 		
 		
 		var label = "";
 		
 		for(var i = 0; i < groupsInPc.length; i++){
 			var fontsize = width;
 			
 			label = groupsInPc[i][0];
 			if(inPercent){
 				label += " " + Math.round(groupsInPc[i][1]) + "%";
 			} else {
 				label += " " + groups[i][1];
 			}
 			
 			if(!vertical){
 				dh = height - y;
 				dw = (onePc * groupsInPc[i][1]) / dh;
 				
 				context.fillStyle = colors[i];
 				context.fillRect(x,y,dw,dh);
 				
 				context.lineWidth = 2;
  				context.strokeStyle = bgcolor;
				context.strokeRect(x,y,dw,dh);
				
				context.font= fontsize + "px sans";
				fontwidth = context.measureText (label).width;
				while(fontwidth > dw){
					fontsize -= 10;
					context.font= fontsize + "px sans";
					fontwidth = context.measureText(label).width;
				}
				
				while(fontsize > dh / 2.0){
					fontsize -= 10;
					context.font= fontsize + "px sans";
					fontwidth = context.measureText(label).width;
				}
				
				context.fillStyle = bgcolor;
				context.fillText(label,
					x + Math.round((dw - fontwidth) / 2),
					y + Math.round(dh / 2) + Math.round(fontsize / 2));
 				
 				x += dw;
 				vertical = true;
 			} else {
 				dw = width - x;
 				dh = (onePc * groupsInPc[i][1]) / dw;
 				
 				context.fillStyle = colors[i];
 				context.fillRect(x,y,dw,dh);
 				
 				context.lineWidth = 2;
  				context.strokeStyle = bgcolor;
				context.strokeRect(x,y,dw,dh);
				
				context.font= fontsize + "px sans";
				fontwidth = context.measureText (label).width;
				while(fontwidth > dw){
					fontsize -= 10;
					context.font= fontsize + "px sans";
					fontwidth = context.measureText(label).width;
				}
				
				while(fontsize > dh / 2.0){
					fontsize -= 10;
					context.font= fontsize + "px sans";
					fontwidth = context.measureText(label).width;
				}
				
				context.fillStyle = bgcolor;
				context.fillText(label,
					x + Math.round((dw - fontwidth) / 2),
					y + Math.round(dh / 2) + Math.round(fontsize / 2));
 				
 				y += dh;
 				vertical = false;
 			}
 			
 		}
	}
}

function DataUnit(){
	var m_characteristics = new Array();
	
	this.getCharacteristics = getCharacteristics;
	this.addCharacteristic = addCharacteristic;
	this.getCharacteristicByName = getCharacteristicByName;
	
	function getCharacteristics(){
		return m_characteristics;
	}
	
	function addCharacteristic(newCharacteristic){
		if(!characteristicExists(newCharacteristic)){
			m_characteristics.push(newCharacteristic);
		} else {
			throw "Characteristic with name '" + newCharacteristic.getName() + "' allready exists!";
		}
	}
	
	function getCharacteristicByName(characteristicName){
		for (var i = 0; i < m_characteristics.length; i++){
			if(m_characteristics[i].getName() == characteristicName){
				return m_characteristics[i];
			}
		}
		return null;
	}
	
	function indexOfCharacteristic(characteristic){
		for (var i = 0; i < m_characteristics.length; i++){
			if(m_characteristics[i].getName() == characteristic.getName()){
				return i;
			}
		}
		return -1;
	}
	
	function characteristicExists(characteristic){
		for (var i = 0; i < m_characteristics.length; i++){
			if(m_characteristics[i].getName() == characteristic.getName()){
				return true;
			}
		}
		return false;
	}
}

function Characteristic() {
	var m_name = "";
	var m_value = null;
	
	this.setName = setName;
	this.setValue = setValue;
	this.getName = getName;
	this.getValue = getValue;
	
	function setName(theName){
		m_name = theName;
	}
	
	function setValue(theValue){
		m_value = theValue;
	}
	
	function getName(){
		return m_name;
	}
	
	function getValue(){
		return m_value;
	}
}
