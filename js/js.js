'use strict'


function boton(){
 var name ="";

   let a = document.getElementById('pdf');
    a.innerHTML = '<embed src="2-719-1588.pdf"  width= "700px" height="650px"> ';



}

function agregar(){
// I know the proper spelling is colour ;)
var doc = new jsPDF();
doc.setTextColor(100);
doc.text("This is gray.", 40, 80);
doc.save("2-719-1588.pdf")

}


// pdf con contraseña
// var doc = new jsPDF({
//     // jsPDF supports encryption of PDF version 1.3.
//     // Version 1.3 just uses RC4 40-bit which is kown to be weak and is NOT state of the art.
//     // Keep in mind that it is just a minimal protection.
//     encryption: {
//       userPassword: "user",
//       ownerPassword: "owner",
//       userPermissions: ["print", "modify", "copy", "annot-forms"]
//       // try changing the user permissions granted
//     }
//   });
  
//   doc.setFontSize(40);
//   doc.text("Octonyan loves jsPDF", 35, 25);
//   doc.addImage("examples/images/Octonyan.jpg", "JPEG", 15, 40, 180, 180);
  