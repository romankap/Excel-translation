var test = function() {
    console.log("hello");
}
test();


function handleFile(e) {
  var files = e.target.files;
  var i,f;
  for (i = 0, f = files[i]; i != files.length; ++i) {
    var reader = new FileReader();
    var name = f.name;
    reader.onload = function(e) {
      var data = e.target.result;

      var workbook = XLSX.read(data, {type: 'binary'});

      console.log("Inside handleFile(1)");
        
    };
      reader.readAsBinaryString(f);
      console.log("Inside handleFile(2)");
      $("#download-btn").show();
      
  }
}


window.onload = function() {
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', handleFile, false);
    
    $("#download-btn").hide();
}