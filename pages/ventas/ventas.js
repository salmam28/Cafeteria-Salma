window.crearBaseDatos();
$(document).ready(function () {

  $('#todo_todo').hide();





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
  var totalPagar = 0;

  $('#ListaProductosSeleccionados').on('change', 'input', function () {
    const idProd = $(this).attr('id').substring(9, 10);

    for (let i = 0; i < productosSeleccionados.length; i++) {
      const prod = productosSeleccionados[i].producto;
      if (idProd == prod.rowid) {
        prod.cantidad = $(this).val();
        prod.precio_total = prod.precio * prod.cantidad;
        llenarListaProductos();
        return
      }

    }
  })


  function llenarListaProductos() {
    totalPagar = 0;
    $('#ListaProductosSeleccionados').html('');
    for (let i = 0; i < productosSeleccionados.length; i++) {
      const produc = productosSeleccionados[i].producto;
      totalPagar = totalPagar + produc.precio_total

      $('#ListaProductosSeleccionados').append(
        `<li class="row" style="margin:4px">
        <span class="col">
          ${produc.nombre}
        </span>
        <span class="col">
          <input type="number" min="1" id="cantidad-${produc.rowid}" value="${produc.cantidad}" class="form-control" />
        </span>
        <span class="col" id="precio-total-${produc.rowid}">
          $${produc.precio}
        </span>
        <span class="col" id="precio-total-${produc.rowid}">
          $${produc.precio_total}
        </span>
        <span class="col">
        <a href='#' class='btn btn-danger quitarProducto' data-codigo='${produc.rowid}' >\
        <i class='fa fa-trash-alt'></i>\
    </a>\
        </span>
        
        </li>`
      );

    }
    $('#totalPagar').html('$' + totalPagar);



  }


  $('#btn-agregar-producto').click(function () {
    const idP = parseInt($('#selectProductos option:selected').val());
    const prod = $('#selectProductos option:selected').data();
    prod.producto.cantidad = 1;
    prod.producto.precio_total = prod.producto.precio;
    let encontrado = false;
    for (let i = 0; i < productosSeleccionados.length; i++) {
      const prod = productosSeleccionados[i].producto;
      if (prod.rowid == idP) {
        encontrado = true;
      }
    }

    if (!encontrado) {
      productosSeleccionados.push(prod);
      llenarListaProductos();
      $('#todo_todo').show('fast');

    }
  });

  $('#formbuscarclientes').on('click', '.quitarProducto', function () {
    const cod = $(this).data('codigo');
    let restantes = [];




    for (let i = 0; i < productosSeleccionados.length; i++) {
      const prod = productosSeleccionados[i];
      if (prod.producto.rowid != cod) {
        restantes.push(prod);
      }
    }
    productosSeleccionados = restantes;
    llenarListaProductos();
  })


  $('#formbuscarclientes').submit(function (e) {

    const valor = $('#dineroEntregado').val();
    $('#dineroDevuelta').html(valor - totalPagar);
    const USER = JSON.parse(localStorage.usuario);
    const f = new Date().toISOString();
    const idUsu = USER.rowid;

    sql = "INSERT INTO ventas(usuario_id,fecha) VALUES(?,?)";

    window.query(sql, [idUsu, f]).then(function (result) {
      codiVenta = result.insertId;

      for (let i = 0; i < productosSeleccionados.length; i++) {
        const prod = productosSeleccionados[i].producto;
        crearDetalle(prod.rowid, prod.cantidad, prod.precio);
      }
      function crearDetalle(prodId,prodCant,prodPrecio) {
        sql = "INSERT INTO venta_detalle(venta_id,producto_id,cantidad,precio) VALUES(?,?,?,?)";

        window.query(sql, [codiVenta, prodId,prodCant,prodPrecio]).then(function (result) {
          
        },function () {
          toastr.error('Error al agregar producto a la venta');
        });
      } 
      toastr.success('VEnta creada con éxito');
      productosSeleccionados = [];
      llenarListaProductos();
      $('#buscarNombre input').val('');
    },
      function () {
        toastr.error('No se pudo crear venta');
      }

    ); 


    e.preventDefault();
  })
});