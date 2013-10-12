function TreeMap(container, data, labels, colors, background) {
    //container, draw object and background rect
    this.draw = null;
    this.container = null;
    this.rect = null;
    
    //input values
    this.data = data;
    this.labels = labels;
    this.colors = colors;
    this.background = background;
    
    //values calculated by init
    this.width = 0;
    this.height = 0;
    this.onePercentWidth = 0;
    this.onePercentHeight = 0;
    this.onePercentData = 0;
    
    this.draw = function() {
        //init container
        this.draw = SVG(container);
        this.container = document.getElementById(container);
        this.container.style.overflow = "hide";
        
        //sort data and labels
        var sorted = false;
        while (!sorted) {
                sorted = true;
                for (i = 0; i < this.data.length - 1; i++) {
                        if (this.data[i] < this.data[i + 1]) {
                                var swapD = this.data[i];
                                this.data[i] = this.data[i + 1];
                                this.data[i + 1] = swapD;
                                
                                var swapL = this.labels[i];
                                this.labels[i] = this.labels[i + 1];
                                this.labels[i + 1] = swapL;
                                
                                var swapC = this.colors[i];
                                this.colors[i] = this.colors[i + 1];
                                this.colors[i + 1] = swapC;
                                
                                sorted = false;
                        }
                }
        }
        
        console.log(this.labels);
        console.log(this.data);
        console.log(this.colors);
        
        //Load container size
        this.width = this.container.style.width;
        this.height = this.container.style.height;
        this.width = this.width.replace("px","");
        this.height = this.height.replace("px","");
        
        //init background
        this.rect = this.draw.rect(this.width,this.height).fill(this.background);
        
        //calucalte percentages
        this.onePercentWidth = this.width / 100;
        this.onePercentHeight = this.height / 100;
        this.onePercentData = this.data[0] / 100;
        
        this.drawData();
    };
    
    this.drawData = function() {
        for (i = 0; i < this.data.length; i++) {
            var total = this.width * this.height;
            var thisValue = (total / 100) * (data[i] / this.onePercentData);
            
            var ratio = this.width / this.height;
            
            var w = Math.sqrt(thisValue * ratio);
            var h = thisValue / w;
            
            var thisRect = this.draw.rect(0,0).move(0,this.height).fill(this.colors[i]);
            thisRect.animate().size(w,h).move(0,this.height - h);
        }
    };
}