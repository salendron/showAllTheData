
function DataMap(container, xValues, yValues, categoryValues, categories, colors, pointNames, mouseoverCallback, mouseOutCallback, background, circleScaleFactor, animationTimeout) {
    //container, draw object and background rect
    this.draw = null;
    this.container = null;
    this.rect = null;
    
    //input values
    this.xValues = xValues;
    this.yValues = yValues;
    this.categoryValues = categoryValues;
    this.categories = categories;
    this.colors = colors;
    this.pointNames = pointNames;
    this.mouseoverCallback = mouseoverCallback;
    this.mouseOutCallback = mouseOutCallback;
    this.background = background;
    this.circleScaleFactor = circleScaleFactor;
    this.animationTimeout = animationTimeout;
    
    //values calculated by init
    this.width = 0;
    this.height = 0;
    this.ratio = 0;
    this.circleSize = 0;
    this.circleGrowth = 0;
    
    //refrence to this for callback functions
    var me = this;
    
    //comparator to sort points array
    this.comparePoints = function(a,b) {
        if (a['size'] < b['size'])
           return -1;
        if (a['size'] > b['size'])
          return 1;
        return 0;
    };
    
    //sort points by size on z-index
    this.sortPoints = function() {
        var sortable = [];
        for (var dataPoint in me.dataPoints){
              sortable.push(me.dataPoints[dataPoint]);
        }
                    
        sortable.sort(me.comparePoints);
        sortable = sortable.reverse();
        for (i = 0; i < sortable.length; i++) {
            sortable[i]['point'].front();
        }
    };
    
    //search for category index by value
    this.getCategoryColor = function(categoryName) {
      for(i = 0; i < me.categories.length; i++){
        if (me.categories[i] == categoryName) {
            return me.colors[i];
        }
      }
      console.log('getCategoryIndex: No Color found for Category:' + categoryName);
      return '#000000';
    };
    
    //vars and function to draw it all
    this.drawCount = 0;
    this.drawData = function() {        
        var i = me.drawCount;
        if (i < me.xValues.length) {
            var x = me.xValues[i];
            var y = me.yValues[i];
            
            var color = me.getCategoryColor(me.categoryValues[i]);
            
            var pointName = x  + "|" + y + "|" + color;
            if (me.dataPoints[pointName] == null) {
                var point = me.draw.circle(me.circleSize).move(x-(me.circleSize / 2),y-(me.circleSize / 2)).fill(color).attr({'fill-opacity': 0.5});
                me.dataPoints[pointName] = {point:point, size:me.circleSize, name: me.pointNames[i], value: 1, category: me.categoryValues[i]};
                
                //Add Mouseover and out Listeners
                me.dataPoints[pointName]['point'].on('mouseover', 
                                                        function() {
                                                           me.dataPoints[pointName]['point'].attr({'fill-opacity': 0.9});
                                                           me.mouseoverCallback(me.dataPoints[pointName]['name'], me.dataPoints[pointName]['category'],me.dataPoints[pointName]['value']);
                                                        }  
                                                    );
                
                me.dataPoints[pointName]['point'].on('mouseout', 
                                                        function() {
                                                           me.dataPoints[pointName]['point'].attr({'fill-opacity': 0.5});
                                                           me.mouseOutCallback(me.dataPoints[pointName]['name'], me.dataPoints[pointName]['category'],me.dataPoints[pointName]['value']);
                                                        }  
                                                    );
                
            } else {
                me.dataPoints[pointName]['size'] = me.dataPoints[pointName]['size'] + me.circleGrowth;
                me.dataPoints[pointName]['value'] = me.dataPoints[pointName]['value'] + 1;
                me.dataPoints[pointName]['point'].animate().size(me.dataPoints[pointName]['size'],me.dataPoints[pointName]['size']);
            }
            
            me.sortPoints();
            
            me.drawCount++;
            window.setTimeout(me.drawData, me.animationTimeout);
        }
    };
    
    this.draw = function() {
        //init container
        this.draw = SVG(container);
        this.container = document.getElementById(container);
        this.container.style.overflow = "hide";
        
        //Load container size
        this.width = this.container.style.width;
        this.height = this.container.style.height;
        this.width = this.width.replace("px","");
        this.height = this.height.replace("px","");
        
        this.ratio = this.width / this.height;
        
        //load circle size
        this.circleSize = (this.width / 200 / 20) * this.circleScaleFactor;
        this.circleGrowth = (this.width / 2700) * this.circleScaleFactor;
        
        //init background
        this.rect = this.draw.rect(this.width,this.height).fill(this.background);
        
        //init data poijnt
        this.dataPoints = new Object();
        
        this.drawCount = 0;
        this.drawData();
    };
    
    //ZOOM
    this.zoom = function(e)
    {
        var evt = window.event || e //equalize event object
        var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta;
            
        var zoomFactor = 40;
        if(delta < 0){
                zoomFactor *= -1; 
        }
        
        if(me.draw.viewbox().zoom > 7 && delta > 0) { return; }
        
        var canvas = this.container;
        
        newWidth = me.draw.viewbox().width - zoomFactor;
        newHeight = me.draw.viewbox().height - (zoomFactor / me.ratio) * 1;
        newX = me.draw.viewbox().x + (zoomFactor / 2);
        newY = me.draw.viewbox().y + ((zoomFactor / me.ratio) / 2);
        
        
        if(newX <= 0){ newX = 0; }
        if(newY <= 0){ newY = 0; }
        if(newWidth <= 10){ newWidth = 10; }
        if(newHeight <= 10){ newHeight = 10 / me.ratio; }
        
        if(newWidth > this.width || newHeight > this.height){
                newX = 0;
                newY = 0;
                newWidth = me.width;
                newHeight = me.height;
        }
        
        me.draw.viewbox(newX,newY,newWidth,newHeight);
        me.rect.size(newWidth,newHeight).move(newX,newY);
    };
    
    this.activateZoom = function(){
        var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";

        if (document.attachEvent) { //IE
            me.container.attachEvent("on"+mousewheelevt, this.zoom);
        } else if (document.addEventListener) { //WC3 browsers
            me.container.addEventListener(mousewheelevt, this.zoom, false);
        }
    };
    
    //DRAG
    this.dragFromX = null;
    this.dragFromY = null;
    this.dragActive = false;
    
    this.activateDrag = function() {
        var element = this.container;
        
        element.addEventListener("mousedown", function(e){
            me.dragActive = true;
        });
        
        element.addEventListener("mousemove", function(e){
            if (me.dragActive) {
                if(me.dragFromX != null && me.dragFromY != null){
                        var toX = e.x;
                        var toY = e.y;
                
                        deltaX = me.dragFromX - toX;
                        deltaY = me.dragFromY - toY;
                        
                        newX = me.draw.viewbox().x + deltaX;
                        newY = me.draw.viewbox().y + deltaY;
                        
                        me.draw.viewbox(newX,newY,me.draw.viewbox().width,me.draw.viewbox().height);
                        me.rect.size(me.draw.viewbox().width,me.draw.viewbox().height).move(newX,newY);
                }
                
                me.dragFromX = e.x;
                me.dragFromY = e.y; 
            }
	}, false);
        
        element.addEventListener("mouseup", function(e){
            me.dragFromX = null;
            me.dragFromY = null;
            me.dragActive = false;
	}, false);
    };
}