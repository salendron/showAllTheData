/**
 * @author salendron
 */

function Log(){
	var m_logLevel = 0; //0 = DEBUG; 1 = INFO; 2 = WARNING; 3 = ERROR
	
	this.e = e;
	this.w = w;
	this.i = i;
	this.d = d;
	
	function e(msg)
    {
        writeLog(3, msg);
    }
    
    function w(msg)
    {
        writeLog(2, msg);
    }
    
    function i(msg)
    {
        writeLog(1, msg);
    }
    
    function d(msg)
    {
        writeLog(0, msg);
    }
    
    function writeLog(level, msg){
    	if(level >= m_logLevel){
    		if( window.console && window.console.log ) {
    			switch(level)
				{
				case 0:
				  console.log ("DEBUG - " + msg );
				  break;
				case 1:
				  console.log ("INFO - " + msg );
				  break;
				case 2:
				  console.log ("WARNING - " + msg );
				  break;
				case 3:
				  console.log ("ERROR - " + msg );
				  break;
				}
			}
    	}
    }
}
			
