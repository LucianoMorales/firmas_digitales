
            

     
$.ajax({
		
    url:'php/directorios.php',
    type: 'post',
    beforeSend: function () {

        const Toast = Swal.mixin({
toast: true,
position: 'top-end',
showConfirmButton: false,
timer: 3000,
timerProgressBar: true,
didOpen: (toast) => {
toast.addEventListener('mouseenter', Swal.stopTimer)
toast.addEventListener('mouseleave', Swal.resumeTimer)
}
})

Toast.fire({
icon: 'warning',
title: 'Procesando, espere por favor...'
})


            },
success: function(datos){
    $("#valores").html(datos);
    

}

});



fabric.LineArrow = fabric.util.createClass(fabric.Line, {

type: 'lineArrow',

initialize: function(element, options) {
options || (options = {});
this.callSuper('initialize', element, options);
},

toObject: function() {
return fabric.util.object.extend(this.callSuper('toObject'));
},

_render: function(ctx) {
this.callSuper('_render', ctx);

// do not render if width/height are zeros or object is not visible
if (this.width === 0 || this.height === 0 || !this.visible) return;

ctx.save();

var xDiff = this.x2 - this.x1;
var yDiff = this.y2 - this.y1;
var angle = Math.atan2(yDiff, xDiff);
ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
ctx.rotate(angle);
ctx.beginPath();
//move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
ctx.moveTo(10, 0);
ctx.lineTo(-20, 15);
ctx.lineTo(-20, -15);
ctx.closePath();
ctx.fillStyle = this.stroke;
ctx.fill();

ctx.restore();

}
});

fabric.LineArrow.fromObject = function(object, callback) {
callback && callback(new fabric.LineArrow([object.x1, object.y1, object.x2, object.y2], object));
};

fabric.LineArrow.async = true;


var Arrow = (function() {
function Arrow(canvas, color, callback) {
this.canvas = canvas;
this.className = 'Arrow';
this.isDrawing = false;
this.color = color;
this.callback = callback;
this.bindEvents();
}

Arrow.prototype.bindEvents = function() {
var inst = this;
inst.canvas.on('mouse:down', function(o) {
inst.onMouseDown(o);
});
inst.canvas.on('mouse:move', function(o) {
inst.onMouseMove(o);
});
inst.canvas.on('mouse:up', function(o) {
inst.onMouseUp(o);
});
inst.canvas.on('object:moving', function(o) {
inst.disable();
})
}

Arrow.prototype.unBindEventes = function () {
var inst = this;
inst.canvas.off('mouse:down');
inst.canvas.off('mouse:up');
inst.canvas.off('mouse:move');
inst.canvas.off('object:moving');
}

Arrow.prototype.onMouseUp = function(o) {
var inst = this;
inst.disable();
inst.unBindEventes();
if (inst.callback) inst.callback();
};

Arrow.prototype.onMouseMove = function(o) {
var inst = this;
if (!inst.isEnable()) {
return;
}

var pointer = inst.canvas.getPointer(o.e);
var activeObj = inst.canvas.getActiveObject();
activeObj.set({
x2: pointer.x,
y2: pointer.y
});
activeObj.setCoords();
inst.canvas.renderAll();
};

Arrow.prototype.onMouseDown = function(o) {
var inst = this;
inst.enable();
var pointer = inst.canvas.getPointer(o.e);

var points = [pointer.x, pointer.y, pointer.x, pointer.y];
var line = new fabric.LineArrow(points, {
strokeWidth: 5,
fill: (inst.color) ? inst.color : 'red',
stroke: (inst.color) ? inst.color : 'red',
originX: 'center',
originY: 'center',
hasBorders: false,
hasControls: true,
selectable: true
});

inst.canvas.add(line).setActiveObject(line);
};

Arrow.prototype.isEnable = function() {
return this.isDrawing;
}

Arrow.prototype.enable = function() {
this.isDrawing = true;
}

Arrow.prototype.disable = function() {
this.isDrawing = false;
}

return Arrow;
}());



var PDFAnnotate = function(container_id, url, options = {}) {
this.number_of_pages = 0;
this.pages_rendered = 0;
this.active_tool = 1; // 1 - Free hand, 2 - Text, 3 - Arrow, 4 - Rectangle
this.fabricObjects = [];
this.fabricObjectsData = [];
this.color = '#212121';
this.borderColor = '#000000';
this.borderSize = 1;
this.font_size = 12;
this.active_canvas = 0;
this.container_id = container_id;
this.url = url;

this.pageImageCompression = options.pageImageCompression
? options.pageImageCompression.toUpperCase()
: "NONE";
var inst = this;

var loadingTask = pdfjsLib.getDocument(this.url);
loadingTask.promise.then(function (pdf) {
    var scale = options.scale ? options.scale : 1.3;
    inst.number_of_pages = pdf.numPages;

    for (var i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then(function (page) {
            var viewport = page.getViewport({scale: scale});
            var canvas = document.createElement('canvas');
            document.getElementById(inst.container_id).appendChild(canvas);
            canvas.className = 'pdf-canvas';
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            context = canvas.getContext('2d');

            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
                $('.pdf-canvas').each(function (index, el) {
                    $(el).attr('id', 'page-' + (index + 1) + '-canvas');
                });
                inst.pages_rendered++;
                if (inst.pages_rendered == inst.number_of_pages) inst.initFabric();
            });
        });
    }
}, function (reason) {
    console.error(reason);
});

this.initFabric = function () {
    var inst = this;
    let canvases = $('#' + inst.container_id + ' canvas')
    canvases.each(function (index, el) {
        var background = el.toDataURL("image/png");
        var fabricObj = new fabric.Canvas(el.id, {
            freeDrawingBrush: {
                width: 1,
                color: inst.color
            }
        });
        inst.fabricObjects.push(fabricObj);
        if (typeof options.onPageUpdated == 'function') {
            fabricObj.on('object:added', function() {
                var oldValue = Object.assign({}, inst.fabricObjectsData[index]);
                inst.fabricObjectsData[index] = fabricObj.toJSON()
                options.onPageUpdated(index + 1, oldValue, inst.fabricObjectsData[index]) 
            })
        }
        fabricObj.setBackgroundImage(background, fabricObj.renderAll.bind(fabricObj));
        $(fabricObj.upperCanvasEl).click(function (event) {
            inst.active_canvas = index;
            inst.fabricClickHandler(event, fabricObj);
        });
        fabricObj.on('after:render', function () {
            inst.fabricObjectsData[index] = fabricObj.toJSON()
            fabricObj.off('after:render')
        })

        if (index === canvases.length - 1 && typeof options.ready === 'function') {
            options.ready()
        }
    });
}

this.fabricClickHandler = function(event, fabricObj) {
    var inst = this;
    if (inst.active_tool == 2) {
        var text = new fabric.IText('ingrese comentario', {
            left: event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left,
            top: event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top,
            fill: inst.color,
            fontSize: inst.font_size,
            selectable: true
        });
        fabricObj.add(text);
        inst.active_tool = 0;
    }
}
}

PDFAnnotate.prototype.enableSelector = function () {
var inst = this;
inst.active_tool = 0;
if (inst.fabricObjects.length > 0) {
    $.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.isDrawingMode = false;
    });
}
}

PDFAnnotate.prototype.enablePencil = function () {

var inst = this;
inst.active_tool = 1;
if (inst.fabricObjects.length > 0) {
    $.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.isDrawingMode = true;
    });
}
}

PDFAnnotate.prototype.enableAddText = function () {
var inst = this;
inst.active_tool = 2;
if (inst.fabricObjects.length > 0) {
    $.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.isDrawingMode = false;
    });
}
}


PDFAnnotate.prototype.addImageToCanvas = function () {
var inst = this;
var fabricObj = inst.fabricObjects[inst.active_canvas];

if (fabricObj) {
    var inputElement = document.createElement("input");
    inputElement.type = 'file'
    inputElement.accept = ".jpg,.jpeg,.png,.PNG,.JPG,.JPEG";
    inputElement.onchange = function() {
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            inputElement.remove()
            var image = new Image();
            image.onload = function () {
                fabricObj.add(new fabric.Image(image))
            }
            image.src = this.result;
        }, false);
        reader.readAsDataURL(inputElement.files[0]);
    }
    document.getElementsByTagName('body')[0].appendChild(inputElement)
    inputElement.click()
} 
}

PDFAnnotate.prototype.enableRectangle = function () {
var inst = this;
var fabricObj = inst.fabricObjects[inst.active_canvas];
inst.active_tool = 4;
if (inst.fabricObjects.length > 0) {
    $.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.isDrawingMode = false;
    });
}

var rect = new fabric.Rect({
    width: 50,
    height: 50,
    fill: inst.color,
    stroke: inst.borderColor,
    strokeSize: inst.borderSize
});
fabricObj.add(rect);
}

PDFAnnotate.prototype.enableAddArrow = function () {
var inst = this;
inst.active_tool = 3;
if (inst.fabricObjects.length > 0) {
    $.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.isDrawingMode = false;
        new Arrow(fabricObj, inst.color, function () {
            inst.active_tool = 0;
        });
    });
}
}


PDFAnnotate.prototype.deleteSelectedObject = function () {
var inst = this;
var activeObject = inst.fabricObjects[inst.active_canvas].getActiveObject();
if (activeObject)
{
    if (confirm('Desea eliminar elemento ?')) inst.fabricObjects[inst.active_canvas].remove(activeObject);
}
}

PDFAnnotate.prototype.savePdf = function (fileName) {
var inst = this;
var doc = new jspdf.jsPDF();
if (typeof fileName === 'undefined') {
    fileName = `${new Date().getTime()}.pdf`;
}

inst.fabricObjects.forEach(function (fabricObj, index) {
    if (index != 0) {
        doc.addPage();
        doc.setPage(index + 1);
    }
    doc.addImage(
        fabricObj.toDataURL({
            format: 'png'
        }), 
        inst.pageImageCompression == "NONE" ? "PNG" : "JPEG", 
        0, 
        0,
        doc.internal.pageSize.getWidth(), 
        doc.internal.pageSize.getHeight(),
        `page-${index + 1}`, 
        ["FAST", "MEDIUM", "SLOW"].indexOf(inst.pageImageCompression) >= 0
        ? inst.pageImageCompression
        : undefined
    );
    if (index === inst.fabricObjects.length - 1) {
        doc.save(fileName);
    }
})




}

PDFAnnotate.prototype.setBrushSize = function (size) {
var inst = this;
$.each(inst.fabricObjects, function (index, fabricObj) {
    fabricObj.freeDrawingBrush.width = size;
});
}

PDFAnnotate.prototype.setColor = function (color) {
var inst = this;
inst.color = color;
$.each(inst.fabricObjects, function (index, fabricObj) {
    fabricObj.freeDrawingBrush.color = color;
});
}

PDFAnnotate.prototype.setBorderColor = function (color) {
var inst = this;
inst.borderColor = color;
}

PDFAnnotate.prototype.setFontSize = function (size) {
this.font_size = size;
}

PDFAnnotate.prototype.setBorderSize = function (size) {
this.borderSize = size;
}

PDFAnnotate.prototype.clearActivePage = function () {
var inst = this;
var fabricObj = inst.fabricObjects[inst.active_canvas];
var bg = fabricObj.backgroundImage;
if (confirm('Desea limpiar la pagina?')) {
    fabricObj.clear();
    fabricObj.setBackgroundImage(bg, fabricObj.renderAll.bind(fabricObj));
}
}

PDFAnnotate.prototype.serializePdf = function() {
var inst = this;
return JSON.stringify(inst.fabricObjects, null, 4);
}



PDFAnnotate.prototype.loadFromJSON = function(jsonData) {
var inst = this;
$.each(inst.fabricObjects, function (index, fabricObj) {
    if (jsonData.length > index) {
        fabricObj.loadFromJSON(jsonData[index], function () {
            inst.fabricObjectsData[index] = fabricObj.toJSON()
        })
    }
})
}






$('#buscar').click(function(e){

e.preventDefault();

$.ajax({
    
    url:'php/buscar.php',
    type: 'post',

   
})
.done(function(res){
    var x = res;
  


var pdf = new PDFAnnotate("pdf-container","archivo_cache/"+ x , {
onPageUpdated(page, oldData, newData) {
  console.log(page, oldData, newData);
},
ready() {
  console.log("Plugin initialized successfully");
  
},
scale: 1.2,
pageImageCompression: "", // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
});




$(document).ready(function ingresar_paciente(){


function changeActiveTool(event) {
var element = $(event.target).hasClass("tool-button")
  ? $(event.target)
  : $(event.target).parents(".tool-button").first();
$(".tool-button.active").removeClass("active");
$(element).addClass("active");
}

$('#seleccionar').click(function(e){
event.preventDefault();
changeActiveTool(event);
pdf.enableSelector();
})



$('#pencil').click(function(e){
e.preventDefault();
changeActiveTool(event);
pdf.enablePencil();
})

$('#text').click(function(e){
      e.preventDefault();
      changeActiveTool(event);
pdf.enableAddText();
})


$('#image').click(function(e){
    e.preventDefault();
    changeActiveTool(event);
    pdf.addImageToCanvas()
    
})
$('#select_delete').click(function(e){
e.preventDefault();
changeActiveTool(event);
pdf.deleteSelectedObject();

})
$('#clear_page').click(function(e){
e.preventDefault();
changeActiveTool(event);
pdf.clearActivePage();

})

$('#save').click(function(e){
e.preventDefault();
pdf.savePdf(x); 


})
}


)






// function enableAddArrow(event) {
//     event.preventDefault();
//     changeActiveTool(event);
//     pdf.enableAddArrow();
// }



// function enableRectangle(event) {
//     event.preventDefault();
//     changeActiveTool(event);
//     pdf.setColor('rgba(255, 0, 0, 0.3)');
//     pdf.setBorderColor('blue');
//     pdf.enableRectangle();
// }

// function deleteSelectedObject(event) {
//   event.preventDefault();
//   pdf.deleteSelectedObject();
// }

// function savePDF() {
//     // pdf.savePdf();
//     pdf.savePdf('sample.pdf'); // save with given file name
// }

// function clearPage() {
//     pdf.clearActivePage();
// }

function showPdfData() { 

var string = pdf.serializePdf();
$('#dataModal .modal-body pre').first().text(string);
PR.prettyPrint();
$('#dataModal').modal('show');
}

$(function () {
$('.color-tool').click(function () {
    $('.color-tool.active').removeClass('active');
    $(this).addClass('active');
    color = $(this).get(0).style.backgroundColor;
    pdf.setColor(color);
});

$('#brush-size').change(function () {
    var width = $(this).val();
    pdf.setBrushSize(width);
});

$('#font-size').change(function () {
    var font_size = $(this).val();
    pdf.setFontSize(font_size);
});
});


})

});


