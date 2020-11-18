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
    console.log(productosSeleccionados);
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
  $('#dineroEntregado').on('input', function () {
    const valor = $('#dineroEntregado').val();
    $('#dineroDevuelta').html(valor - totalPagar);
  })

  $('#formbuscarclientes').submit(function (e) {

    const USER = JSON.parse(localStorage.usuario);
    const f = new Date().toISOString();
    const idUsu = USER.rowid;
    const desc = $('#descripcion').val();
    const idCliente = 1;
    sql = "INSERT INTO ventas(usuario_id,fecha,descripcion,cliente_id) VALUES(?,?,?,?)";

    window.query(sql, [idUsu, f, desc, idCliente]).then(function (result) {
      let codiVenta = result.insertId;

      for (let i = 0; i < productosSeleccionados.length; i++) {
        const prod = productosSeleccionados[i].producto;
        crearDetalle(prod.rowid, prod.cantidad, prod.precio);
      }
      function crearDetalle(prodId, prodCant, prodPrecio) {
        sql = "INSERT INTO venta_detalle(venta_id,producto_id,cantidad,precio) VALUES(?,?,?,?)";

        window.query(sql, [codiVenta, prodId, prodCant, prodPrecio]).then(function (result) {

        }, function () {
          toastr.error('Error al agregar producto a la venta');
        });
      }
      toastr.success('Venta creada con éxito');
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
  $('#modalVentasCliente').on('shown.bs.modal', function () {
    $("#modalVentas").html('');

    idUsu = 1;
    sql = "SELECT rowid, * FROM clientes WHERE rowid=?";

    window.query(sql, [idUsu]).then(function (result) {
      let cliente = result[0];
      $('#modalVentasCliente .modal-title').html(cliente.nombres + ' ' + cliente.apellidos);

      sql = "SELECT rowid, * FROM ventas WHERE cliente_id=?";

      window.query(sql, [idUsu]).then(function (result) {

        function traerDetalle(venta, venta_id) {
          let sql = "SELECT d.rowid, d.*, p.rowid, p.* FROM venta_detalle d INNER JOIN productos p ON p.rowid=d.producto_id WHERE venta_id=?";
            window.query(sql, [venta_id]).then(function (result) {
            venta.detalle = result;
          })//select detalle_ventas
        }

        for (let i = 0; i < result.length; i++) {
          const venta = result[i];

          traerDetalle(venta, venta.rowid);
          
        }//for ventas

        for (let i = 0; i < result.length; i++) {
          const venta = result[i];
          venta.fecha = new Date(venta.fecha);
          $('#modalVentas').append(`
            <div class='row'>
              <div class='col'>
                ${venta.fecha.toLocaleDateString()} ${venta.fecha.toTimeString().substring(0,5)}
                <div class='row'>
                  <div class='col'id="modalDetalle-${venta.rowid}">
                    
                  </div>
                </div>
              </div>
            </div>`);
        }
        setTimeout( () => {
          console.log(result);
          for (let i = 0; i < result.length; i++) {
            const venta = result[i];
              
            for (let j = 0; j < venta.detalle.length; j++) {
              const detalle = venta.detalle[j];

              $("#modalDetalle-" + venta.rowid).append(`
              <div class='row'>
                <div class='col ml-2'>
                  ${detalle.nombre}
                </div>
                <div class='col'>
                  cant: ${detalle.cantidad}
                </div>
                <div class='col'>
                  $${detalle.precio}
                </div>
              </div>
                `);
            }
          }
        },1000)
      });
    })//select ventas 
  })//select cliente
})
 