
var config = require('../CADViewer_config.json');
var cvjs_debug = config.cvjs_debug;

var express = require('express'),
    router = express.Router();


// makesinglepagepdf

router.post('/makesinglepagepdf', (req, res) => {
    // 6.1.25	
    console.log("/makesinglepagepdf");	
        try {
        
        // parse content
        // make png
        // convert to pdf
            var fileName = req.body.fileName_0;
            var rotation = req.body.rotation_0;
            var pageformat = req.body.page_format_0;
            var base64_file = config.fileLocation + "/" + fileName + '_base64.png';
            var base64_content = ""; 
    
    console.log("base64_file"+base64_file);
    
            var fs = require('fs');		
            fs.readFile( base64_file, 'utf8', function(err, data) {
            
    //		base64_content = data;		
    //console.log("data"+data);			
                
                if (err){
                    res.send("error -loadfile: "+err);  // no file
                    if (config.cvjs_debug) console.log(err);
                }
                else{
                    base64_content = data;
    
                    console.log("base64_content"+base64_content);
    
                    let base64Image = base64_content.split(';base64,').pop();
                    
                    console.log("XX"+base64Image+"WW");
                    fs.writeFile(config.fileLocation + "/" + fileName + '.png', base64Image, {encoding: 'base64'}, function(err) {
                        console.log('File created');
                    
    
    
                /*
                        let buff = new Buffer(base64_content, 'base64');
                        fs.writeFileSync(config.fileLocation + "/" + fileName + '.png', buff);		
                */
                        var commandline = config.converterLocation + config.ax2023_executable+" "+"-i=\""+config.fileLocation+fileName+".png\" -o=\""+config.fileLocation+fileName+".pdf\" -f=pdf -"+pageformat+" -"+rotation;
    
                        const { exec } = require('child_process');
                        exec(commandline, (err, stdout, stderr) => {
                          if (err) {
                            // node couldn't execute the command
                            if (config.cvjs_debug) console.log("Error exec(): "+err);
                            // error handling, method response with error 
                            res.send("error - makesinglepagepdf");  // no file

                            //return;    7.1.3  , error handled by err, 
                          }
                          else{
                            // the *entire* stdout and stderr (buffered)
                            if (config.cvjs_debug) console.log(`stdout-log: ${stdout}`);
                            if (config.cvjs_debug) console.log(`stderr-log: ${stderr}`);
                    // return link to pdd
                            res.send(fileName +".pdf");
                          }
                                
                        });	
    
                    
                    
                    
                    })			
                }
                
                    
            });	
    
    
    
        }
        catch (e) {
            res.send("error - makesinglepagepdf");  // no file
            if (config.cvjs_debug) console.log(e);
        }
    });
    
    module.exports = router;
    
    