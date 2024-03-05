

// Default export is a4 paper, portrait, using millimeters for units
// const doc = new jsPDF();
// const iframe = document.getElementById(');
// let texto = "hola mundo";
// doc.
// doc.text("Hello world!", 10, 10);
// doc.text(texto,20,60);
// doc.save("a4.pdf");

const doc = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [4, 2]
  });
  
  doc.text("Hello world!", 1, 1);

// var margin =10;
// var scale =(doc.internal.pageSize.width - margin*2)/document.body.scrollWidth
// const page = document.querySelector("#text");  

// doc.html(docuemnt.body,{
//     x:margin,
//     y:margin,
//     html2canvas:{
//         scale:scale,
//     }
// })



 function guardar(){
    doc.save('Test.pdf');
    // doc.ouput('dataurlnewwindow',{filname:'test.pdf'})
 }