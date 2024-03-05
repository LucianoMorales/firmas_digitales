'use strict'

$(document).ready(function() {
    $.ajax({
      url: './directorios/count.php',
      success: function(data) {
        $('#pdf-count').text(data);
      }
    });
  });