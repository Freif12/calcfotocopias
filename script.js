document.getElementById('fileInput').addEventListener('change', function(e) {
  var file = e.target.files[0];
  var reader = new FileReader();

  reader.onload = function(e) {
    var arrayBuffer = e.target.result;

    obtenerNumeroPaginasYSize(arrayBuffer, function(data) {
      calcularPrecio(data.numeroPaginas);
      mostrarTamanoPDF(data.size);
    });
  };

  reader.readAsArrayBuffer(file);

  // Eliminar el tamaño del PDF anterior
  eliminarTamanoPDF();
});

// Agregar evento de escucha para cambios en la opción de color
var colorOptions = document.querySelectorAll('input[name="color"]');
colorOptions.forEach(function(option) {
  option.addEventListener('change', function() {
    var fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
      var file = fileInput.files[0];
      var reader = new FileReader();

      reader.onload = function(e) {
        var arrayBuffer = e.target.result;

        obtenerNumeroPaginasYSize(arrayBuffer, function(data) {
          calcularPrecio(data.numeroPaginas);
          mostrarTamanoPDF(data.size);
        });
      };

      reader.readAsArrayBuffer(file);

      // Eliminar el tamaño del PDF anterior
      eliminarTamanoPDF();
    }
  });
});

function calcularPrecio(numeroPaginas) {
  var precios = {
    bw: { pagina: 0.1, hoja: 0.5 },
    color: { pagina: 0.2, hoja: 1 }
  };

  var colorOption = document.querySelector('input[name="color"]:checked').value;
  var precioPorPagina = precios[colorOption].pagina;
  var precioPorHoja = precios[colorOption].hoja;

  var precio = numeroPaginas * (precioPorPagina + precioPorHoja);

  // Mostrar el resultado
  document.getElementById('numPages').textContent = numeroPaginas;
  document.getElementById('estimatedPrice').textContent = precio.toFixed(2);
  document.getElementById('result').style.display = 'block';
}

function obtenerNumeroPaginasYSize(pdfData, callback) {
  pdfjsLib.getDocument({ data: pdfData }).promise.then(function(pdf) {
    var pageNumber = 1;

    pdf.getPage(pageNumber).then(function(page) {
      var viewport = page.getViewport({ scale: 1 });
      var size = {
        width: viewport.width / 72,
        height: viewport.height / 72
      };

      callback({ numeroPaginas: pdf.numPages, size: size });
    });
  });
}

function mostrarTamanoPDF(size) {
  var sizeElement = document.getElementById('pdfSize');
  sizeElement.innerHTML = 'Tamaño del PDF:<br>';
  sizeElement.innerHTML += 'Ancho: ' + size.width.toFixed(2) + ' cm<br>';
  sizeElement.innerHTML += 'Altura: ' + size.height.toFixed(2) + ' cm';
}

function eliminarTamanoPDF() {
  var sizeElement = document.getElementById('pdfSize');
  sizeElement.innerHTML = 'Tamaño del PDF:';
}
