window.crearBaseDatos();
$(document).ready(function () {

  sql = 'SELECT rowid, * FROM clientes'

  window.query(sql).then(function (result) {
    
    var substringMatcher = function (strs) {
      return function findMatches(q, cb) {
        var matches, substringRegex;

        matches = [];
        substrRegex = new RegExp(q, "i");

        $.each(strs, function (i, str) {
          if (
            substrRegex.test(str.nombres) ||
            substrRegex.test(str.apellidos)
          ) {
            matches.push(`${str.nombres} ${str.apellidos}`);
          }
        });

        cb(matches);
      };
    };

    $("#buscarNombre .typeahead").typeahead(
      {
        hint: true,
        highlight: true,
        minLength: 1,
      },
      {
        name: "nombres",
        source: substringMatcher(result),
      }
    );
  },
    function (error) {
      toastr.error('Error,eliminando...');
      console.log('Error,eliminando...', error);
    }
  );

  //LLAMO A LOS PRODUCTOS
  sql = 'SELECT rowid, * FROM productos'

  window.query(sql).then(function (result) {
    //console.log(result);

    for (let i = 0; i < result.length; i++) {
      const prod = result[i];
      const prodString = JSON.stringify(prod);
      $('#selectProductos').append(
        `<option data-producto='` + prodString + `' value=${prod.rowid}>${prod.nombre} $${prod.precio}</option>`
      )
    }
  });
  var productosSeleccionados = [];
  var totaPagar = 0;

  $('#ListaProductosSeleccionados').on('change','input',function () {
    const idProd = $(this).attr('id').substring(9,10);
    console.log(idProd);
    for (let i = 0; i < productosSeleccionados.length; i++) {
      const pro = productosSeleccionados[i].producto;
      if (idProd == pro.rowid){
        prod.cantidad = $(this).val();
      }
      
    }
  })
  

  function llenarListaProductos() {
    $('#ListaProductosSeleccionados').html('');  
    for (let i = 0; i < productosSeleccionados.length; i++) {
      const produc = productosSeleccionados[i].producto;
      $('#ListaProductosSeleccionados').append(
        `<li class="row">
        <span class="col">
          ${produc.nombre}
        </span>
        <span class="col">
          <input type="number"  id="cantidad-${produc.rowid}" value="${produc.cantidad}" class="form-control" />
        </span>
        <span class="col" id="precio-total-${produc.rowid}">
          $${produc.precio}
        </span>
        <span class="col">
        <a href="#" class="quitarProducto">Quitar</a>
        </span>
        
        </li>`
      ); 
          
    }
  }
  $('#btn-agregar-producto').click(function () {
    const idP = parseInt($('#selectProductos option:selected').val());
    const prod = $('#selectProductos option:selected').data();
    prod.cantidad = 1;
    let encontrado = false;
    for (let i = 0; i < productosSeleccionados.length; i++) {
      const prod = productosSeleccionados[i].producto;
      if (prod.rowid == idP ) {
        encontrado = true;
      }
    }

    if (!encontrado) {
      productosSeleccionados.push(prod);
      llenarListaProductos();
    }
    
  });
});