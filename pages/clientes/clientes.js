window.crearBaseDatos();
$(document).ready(
    function () {
        $('#conten-crear').hide();
        $('#conten-editar').hide();

        $('table').on('click', '.eliminar', function () {

            const resp = confirm('¿Esta seguro que quiere elimnarlo?')
            if (resp) {
                const fila = $(this).closest('tr');
                const codi = fila.data('id');


                sql = 'DELETE FROM clientes WHERE rowid=?';

                window.query(sql, [codi]).then(function (result) {
                    fila.remove();
                    toastr.success('Eliminado correctamente')
                    console.log('Eliminado correctamente');
                }, function (error) {
                    toastr.error('Error eliminando...', error);
                })

            }

        });


        sql = 'SELECT *, rowid FROM clientes';
        window.query(sql).then(function (result) {
            var items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];

                $('table tbody').append(
                    "<tr id='fila-"+ u['rowid'] + "'data-id='" + u['rowid'] + "' >\
                        <th>"+ u['rowid'] + "</th>\
                        <td class='td-nombre'>"+ u['nombres'] + "</td>\
                        <td class='td-apellidos'>"+ u['apellidos'] + "</td>\
                        <td class='td-sexo'>"+ u['sexo'] + "</td>\
                        <td class='td-documento'>"+ u['documento'] + "</td>\
                        <td class='td-acudiente'>"+ u['acudiente'] + "</td>\
                        <td class='td-telefono'>"+ u['telefono'] + "</td>\
                        <td>\
                            <div class='btn-group'>\
                                <a href='#' class='btn btn-danger btn-sm eliminar'>\
                                    <i class='fa fa-times'></i>\
                                </a>\
                                <a href='#' class='btn btn-info btn-sm editar'>\
                                    <i class='fa fa-pen'></i>\
                                </a>\
                            </div>\
                        </td>\
                    <tr>"
                );

            }
        }, function (error) {
            toastr.error('No se pudo ingresar dato')
            console.log('Dato ingresado', error);
        })

        var fila_editantdo = null;
        $('table').on('click','.editar',function () {
            var tr = $(this).closest('tr');
            fila_editantdo = tr;
            const id= tr.data('id');

            const nombre = tr.find('.td-nombre').text();
            const apellidos = tr.find('.td-apellidos').text();
            const sexo = tr.find('.td-sexo').text();
            const documento = tr.find('.td-documento').text();
            const acudiente = tr.find('.td-acudiente').text();
            const telefono = tr.find('.td-telefono').text();

            if (sexo == 'F') {
                document.getElementById('sexoFemeEdit').checked = true;
                document.getElementById('sexoMascEdit').checked = false;
            }else{
                document.getElementById('sexoMascEdit').checked = true;
                document.getElementById('sexoFemeEdit').checked = false;
            }


            $('#inputnombreEdit').val(nombre);
            $('#inputapellidosEdit').val(apellidos);
            $('#inputdocumentoEdit').val(documento);
            $('#inputacudienteEdit').val(acudiente);
            $('#inputtelefonoEdit').val(telefono);


            $('#conten-editar').show('fast');
        })
        
        $('#formEditar').submit(function () {
            a = $('#inputnombreEdit').val();
            b = $('#inputapellidosEdit').val();
            c = document.getElementById('sexoFemeEdit').checked ? 'F' : 'M'; 
            d = $('#inputdocumentoEdit').val();
            e = $('#inputacudienteEdit').val();
            f = $('#inputtelefonoEdit').val();


            

            sql = 'UPDATE clientes SET nombres=?,apellidos=?,sexo=?,documento=? ,acudiente=? ,telefono=? WHERE rowid=? ';

            window.query(sql, [a, b, c, d, e, f,fila_editantdo.data('id')]).then(function (result) {
                toastr.success('Se ha editado con éxito');
                fila_editantdo.find('.td-nombre').text(a);
                fila_editantdo.find('.td-apellidos').text(b);
                fila_editantdo.find('.td-sexo').text(c);
                fila_editantdo.find('.td-documento').text(d);
                fila_editantdo.find('.td-acudiente').text(e);
                fila_editantdo.find('.td-telefono').text(f);


                $('#conten-editar').hide();
                
            }, function (error) {
                toastr.error('No se pudo ingresar dato')
                console.log('Dato ingresado', error);
            })


            event.preventDefault();
        }) 

        $('#btncancelEdit').click(
            function () {
                $('#conten-editar').hide();
            }
        )

        $('#btncrear').click(
            function () {
                $('#conten-crear').show('fast');
                $('#inputnombre').val('');
                $('#inputapellidos').val('');
                $('#inputsexo').val('');
                $('#inputdocumento').val('');
                $('#inputacudiente').val('');
                $('#inputtelefono').val('');
            }
        )
        $('#btncancel').click(
            function () {
                $('#conten-crear').hide();
                $('#btncrear').show();
            }
        )
        $('#formcrear').submit(function () {
            a = $('#inputnombre').val();
            b = $('#inputapellidos').val();
            c = document.getElementById('sexoFeme').checked ? 'F' : 'M'; 
            d = $('#inputdocumento').val();
            e = $('#inputacudiente').val();
            f = $('#inputtelefono').val();



            sql = 'INSERT INTO clientes(nombres,apellidos,sexo,documento,acudiente,telefono)VALUES(?,?,?,?,?,?)';

            window.query(sql, [a, b, c, d,e,f]).then(function (result) {
                toastr.success('Cliente creado con éxito');
                

                $('table tbody').append(
                    "<tr id='fila-" + result.insertId + "'data-id='" + result.insertId + "'>\
                        <th>"+ result.insertId + "</th>\
                        <td class='td-nombre'>"+ a + "</td>\
                        <td class='td-apellidos'>"+ b + "</td>\
                        <td class='td-sexo'>"+ c + "</td>\
                        <td class='td-documento'>"+ d + "</td>\
                        <td class='td-acudiente'>"+ e + "</td>\
                        <td class='td-telefono'>"+ f + "</td>\
                        <td>\
                            <div class='btn-group'>\
                                <a href='#' class='btn btn-danger btn-sm eliminar'>\
                                    <i class='fa fa-times'></i>\
                                </a>\
                                <a href='#' class='btn btn-info btn-sm editar'>\
                                    <i class='fa fa-pen'></i>\
                                </a>\
                            </div>\
                        </td>\
                    <tr>"
                );
                $('#conten-crear').hide();
            }, function (error) {
                toastr.error('No se pudo ingresar dato')
                console.log('Dato ingresado', error);
            })


            event.preventDefault();
        })

    })