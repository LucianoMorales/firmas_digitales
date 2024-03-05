
function traername(){
    var x;
    $.ajax({
      
        url:'directorios/directorios.php',
        type: 'post',
       
      
    })

    .done(function(res){
        x=res;
      console.log(res);
      alert(x);
      var pdf = new PDFAnnotate("pdf-container", x, {
        onPageUpdated(page, oldData, newData) {
          console.log(page, oldData, newData);
        },
        ready() {
          console.log("Plugin initialized successfully");
        },
        scale: 1.2,
        pageImageCompression: "", // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
      });
      
    
      

      

})
}