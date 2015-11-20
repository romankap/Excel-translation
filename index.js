var test = function() {
    console.log("hello");
    
}
test();


var dictionary = {};

function handleTranslationFile(evt) {
  var files = evt.target.files; 
    		
    if (files) {
        for (var i=0, f; f=files[i]; i++) {
	          var r = new FileReader();
            r.onload = (function(f) {
                return function(e) {
                    var contents = e.target.result;
                    contents.split("\n").forEach(function(line, index, arr) {
                        if (index === arr.length - 1 && line === "") { return; }
                        var russ = line.substr(0,line.indexOf(','));
                        var heb = line.substr(line.indexOf(',')+1);

                        dictionary[russ] = heb;
                        
                        console.log(index + ". Russian: " + russ + ". Hebrew: " + dictionary[russ]);
                      });
                    $("#upload-sheet-block").show();
                };
            })(f);

            r.readAsText(f);
        }   
    } else {
	      alert("Failed to load files"); 
    }
}

var replace_russ = function(excel_sheet_cell) {
    for(var russ in dictionary) {
        if(dictionary.hasOwnProperty(russ)) {
            if ( excel_sheet_cell.indexOf(String(russ)) > -1)  {
                console.log("Translating: " + russ + " --> " + dictionary[russ]);
                return excel_sheet_cell.replace(russ, dictionary[russ]);
            }
        }
    }   
    return excel_sheet_cell;
}


function handleFile(e) {
  var files = e.target.files;
  var i,f;
  for (i = 0, f = files[i]; i != files.length; ++i) {
    var reader = new FileReader();
    var name = f.name;
    reader.onload = function(e) {
        var data = e.target.result;

        var workbook = XLSX.read(data, {type: 'binary'});
        var outputWorkbook = XLSX.read(data, {type: 'binary'});

        var sheet_name_list = workbook.SheetNames;
        
        sheet_name_list.forEach(function(y) { /* iterate through sheets */
            var worksheet = workbook.Sheets[y];
            var output_sheet = outputWorkbook.Sheets[y];
            
            for (z in worksheet) {
                /* all keys that do not begin with "!" correspond to cell addresses */
                if(z[0] === '!') 
                    continue;
                
                var original_string = String(worksheet[z].v);
                //console.log(y + "!" + z + "=" + original_string.replace("Заказчик", dictionary["Заказчик"])  );

                output_sheet[z].v = replace_russ(original_string);
            }
        });
        
        var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
        var wbout = XLSX.write(outputWorkbook,wopts);

        function s2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
        }

        /* the saveAs call downloads a file on the local machine */
        saveAs(new Blob([s2ab(wbout)],{type:""}), "heb-sheet.xlsx")
        
    };
    // End of onload
    reader.readAsBinaryString(f);
    console.log("Inside handleFile(2)");
    $("#download-btn").show();
      
  }
}


window.onload = function() {
    var fileInput = document.getElementById('fileInput');
    var translationFileInput = document.getElementById('translationFileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', handleFile, false);
    translationFileInput.addEventListener('change', handleTranslationFile, false);
    
    $("#upload-sheet-block").hide();
}