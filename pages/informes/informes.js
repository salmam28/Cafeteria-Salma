window.crearBaseDatos();
$(document).ready(function () {

  sql = 'SELECT rowid, * FROM clientes'

  window.query(sql).then(function (result) {
    console.log(result);
    for (let i = 0; i < result.length; i++) {
      const cliente = result[i];
      $('#selectClientes').append(`
                <option class="opcionCliente" value="${cliente.rowid}">${cliente.nombres} ${cliente.apellidos}</option>
            `);
    }
  }, function (error) {
    toastr.error('Error,eliminando...');
    console.log('Error,eliminando...', error);
  }
  );
  $('#selectClientes').on('change', function () {
    console.log($(this).val());
  })

  $('#btnVentasCliente').click(function () {


    idUsu = $('#selectClientes').val();
    sql = "SELECT rowid, * FROM clientes WHERE rowid=?";

    window.query(sql, [idUsu]).then(function (result) {
      let cliente = result[0];
      $("#hoja-informes").html(`
            <h1 class="text-center text-bold">Ventas de un cliente</h1>
            <h2 class="text-center">Cliente: ${cliente.nombres} ${cliente.apellidos}</h2>
            <div class="row">
              <div class="col">
                <table class="table table-bordered" id="tabla-contenido-informe">
                  <tbody class="tbody"></tbody>
                </table>
              </div>
            </div>
          `);

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
          $('#tabla-contenido-informe>tbody').append(`
                <tr class=''>
                  <td class=''>Venta ${venta.rowid}</td>
                  <td>${venta.fecha.toLocaleDateString()} ${venta.fecha.toTimeString().substring(0, 5)}
                  </td>
                </tr>
                <tr class="pb-5" >
                  <td colspan="2">
                    <table class="table table-bordered tabla-detalle" id="contenido-detalle-${venta.rowid}">
                      <thead class="thead-dark">
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody class="tbody"></tbody>
                    </table>
                  </td>
                </tr>
                    
                `);
        }
        setTimeout(() => {
          console.log(result);
          for (let i = 0; i < result.length; i++) {
            const venta = result[i];

            for (let j = 0; j < venta.detalle.length; j++) {
              const detalle = venta.detalle[j];

              $("#contenido-detalle-" + venta.rowid + ">tbody").append(`
                  <tr class=''>
                    <td class=''>
                      ${detalle.nombre}
                    </td>
                    <td class=''>
                      cant: ${detalle.cantidad}
                    </td>
                    <td class=''>
                      $${detalle.precio}
                    </td>
                    <td class=''>
                      $${detalle.total}
                    </td>
                  </tr>
                    `);
            }
          }
        }, 1000)
      });
    })//select ventas 
  })//select cliente

  $('#btnProductos').click(function () {

    sql = "SELECT rowid, * FROM productos";

    window.query(sql, []).then(function (result) {

      $("#hoja-informes").html(`
            <h1 class="text-center text-bold">Todos los productos</h1>
            <div class="row">
              <div class="col">
                <table class="table table-bordered" id="tabla-contenido-informe">
                <thead class="thead-dark">
                  <tr>
                    <th>Id</th>
                    <th>Producto</th>
                    <th>Abreviatura</th>
                    <th>Precio</th>
                    <th>Costo</th>
                    <th>Descripción</th>
                    <th>Proovedor</th>
                  </tr>
                </thead>
                  <tbody class="tbody"></tbody>
                </table>
              </div>
            </div>
          `);
      for (let i = 0; i < result.length; i++) {
        const prod = result[i];
        $('#tabla-contenido-informe').append(`
          <tr>
            <td>${prod.rowid}</td>
            <td>${prod.nombre}</td>
            <td>${prod.abreviatura}</td>
            <td>${prod.precio}</td>
            <td>${prod.costo}</td>
            <td>${prod.descripcion}</td>
            <td>${prod.proveedor}</td>
          </tr>
        `);
      }
    });
  });
  $('#btnClientes').click(function () {

    sql = "SELECT rowid, * FROM clientes";

    window.query(sql, []).then(function (result) {

      $("#hoja-informes").html(`
            <h1 class="text-center text-bold">Todos los clientes</h1>
            <div class="row">
              <div class="col">
                <table class="table table-bordered" id="tabla-contenido-informe">
                <thead class="thead-dark">
                  <tr>
                    <th>Id</th>
                    <th>Cliente</th>
                    <th>Sexo</th>
                    <th>Documento</th>
                    <th>Acudiente</th>
                    <th>Telefono</th>
                  </tr>
                </thead>
                  <tbody class="tbody"></tbody>
                </table>
              </div>
            </div>
          `);
      for (let i = 0; i < result.length; i++) {
        const clien = result[i];
        $('#tabla-contenido-informe').append(`
          <tr>
            <td>${clien.rowid}</td>
            <td>${clien.nombres} ${clien.apellidos}</td>
            <td>${clien.sexo}</td>
            <td>${clien.documento}</td>
            <td>${clien.acudiente}</td>
            <td>${clien.telefono}</td>
          </tr>
        `);
      }
    });
  });
  $('#btnVentas').click(function () {

    sql = "SELECT v.rowid, v.*, c.nombres, u.nombres as nombres_usuario, c.apellidos FROM ventas v INNER JOIN users u ON u.rowid=v.usuario_id INNER JOIN clientes c ON c.rowid=v.cliente_id";

    window.query(sql, []).then(function (result) {
      console.log(result);
      $("#hoja-informes").html(`
            <h1 class="text-center text-bold">Todos los clientes</h1>
            <div class="row">
              <div class="col">
                <table class="table table-bordered" id="tabla-contenido-informe">
                <thead class="thead-dark">
                  <tr>
                    <th>Id</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>descripcion</th>
                  </tr>
                </thead>
                  <tbody class="tbody"></tbody>
                </table>
              </div>
            </div>
          `);
      for (let i = 0; i < result.length; i++) {
        const venta = result[i];
        $('#tabla-contenido-informe').append(`
          <tr>
            <td>${venta.rowid}</td>
            <td>${venta.nombres_usuario}</td>
            <td>${venta.fecha}</td>
            <td>${venta.nombres} ${venta.apellidos}</td>
            <td>${venta.descripcion}</td>
          </tr>
        `);
      }
    });
  });
});