/**
 * @author salendron
 */

function AreaMap() {
	this.Data = new Array();
	this.AbsoluteNumbers = true;
	this.Colors = new Array();
	this.BackgroundColor = "#FFFFFF";
	this.Font = "sans";
	this.FontColor = "#000000";
	this.Legend = "none"; //none, left, top, right, bottom
	
	this.draw = draw;
	function draw(canvas){
		//getSize
		var width = canvas.width;
		var height= canvas.height;
		
		//get size of 1 percent
		var onePc = (height * width) / 100.0;
		
		//drawing context
		var context = canvas.getContext("2d");

		//background
		context.clearRect(0,0,width,height);
		context.fillStyle = this.BackgroundColor;
 		context.fillRect(0,0,width,height);
		
		//start with a vertical block
 		var vertical = false;
 		
 		//origin of next block
 		var x = 0;
 		var y = 0;
 		
 		//drawing height and width of next block
 		var dh = 0;
 		var dw = 0;
		
		//get a second data array with percent instead of absolute numbers
		var dataInPercent = absoluteNumbersToPercent(this.Data);
		
		//draw it
		for(var i = 0; i < this.Data.length; i++){
			var fontsize = width;
 			
 			var label = this.Data[i][1];
			if (!this.AbsoluteNumbers) {
				label = (Math.round(dataInPercent[i][1] / 0.01) * 0.01) + "%";
			}
			
			if(!vertical){
 				dh = height - y;
 				dw = (onePc * dataInPercent[i][1]) / dh;
 				
 				context.fillStyle = this.Colors[i];
 				context.fillRect(x,y,dw,dh);
 				
 				context.lineWidth = 2;
  				context.strokeStyle = this.BackgroundColor;
				context.strokeRect(x,y,dw,dh);
 				
				drawAreaValue(label,context,dh,dw,x,y,this.BackgroundColor,this.Font);
				drawAreaLabel(dataInPercent[i][0],context,dh,dw,x,y,this.BackgroundColor,this.Font);
				
 				x += dw;
 				vertical = true;
 			} else {
 				dw = width - x;
 				dh = (onePc * dataInPercent[i][1]) / dw;
 				
 				context.fillStyle = this.Colors[i];
 				context.fillRect(x,y,dw,dh);
 				
 				context.lineWidth = 2;
  				context.strokeStyle = this.BackgroundColor;
				context.strokeRect(x,y,dw,dh);
				
				drawAreaValue(label,context,dh,dw,x,y,this.BackgroundColor,this.Font);
				drawAreaLabel(dataInPercent[i][0],context,dh,dw,x,y,this.BackgroundColor,this.Font);
 				
 				y += dh;
 				vertical = false;
 			}
		}
		
		
	}
	
	this.changeValue = changeValue;
	function changeValue(canvas,index,value){
		this.Data[index][1] = value;
		this.draw(canvas);
	}
	
	function drawAreaValue(areavalue, context, areaHeight, areaWidth, areaOriginX, areaOriginY, color, font) {
		var fontsize = areaWidth;
		context.globalAlpha   = 0.2;
		context.font= fontsize + "px " + font;
		fontwidth = context.measureText(areavalue).width;
		
		while(fontwidth > areaWidth){ //scale width
			fontsize -= 10;
			context.font= fontsize + "px " + font;
			fontwidth = context.measureText(areavalue).width;
		}
		
		while(fontsize > areaHeight / 2.0){ //scale height
			fontsize -= 10;
			context.font= fontsize + "px " + font;
			fontwidth = context.measureText(areavalue).width;
		}
		
		context.fillStyle = color;
		context.fillText(areavalue,
			areaOriginX + Math.round((areaWidth - fontwidth) / 2),
			areaOriginY + fontsize);
		
		context.globalAlpha   = 1;
	}
	
	function drawAreaLabel(areaLabel, context, areaHeight, areaWidth, areaOriginX, areaOriginY, color, font) {
		var fontsize = areaWidth;
		
		context.font= fontsize + "px " + font;
		fontwidth = context.measureText(areaLabel).width;
		
		while(fontwidth > areaWidth){ //scale width
			fontsize -= 10;
			context.font= fontsize + "px " + font;
			fontwidth = context.measureText(areaLabel).width;
		}
		
		while(fontsize > areaHeight / 2.0){ //scale height
			fontsize -= 10;
			context.font= fontsize + "px " + font;
			fontwidth = context.measureText(areaLabel).width;
		}
		
		context.fillStyle = color + "33";
		context.fillText(areaLabel,
			areaOriginX + Math.round((areaWidth - fontwidth) / 2),
			areaOriginY + areaHeight);
	}
	
	function absoluteNumbersToPercent(data) {
		var dataInPercent = new Array();
		var count = 0;
		
		//get count
		for(var i = 0; i < data.length; i++){
			count += data[i][1];
		}
		
		//get count
		for(var i = 0; i < data.length; i++){
			d = new Array();
			d[0] = data[i][0];
			d[1] = data[i][1] / (count / 100.0);
			dataInPercent.push(d);
		}
		
		return dataInPercent;
	}
}
