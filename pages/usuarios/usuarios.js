window.crearBaseDatos();
$(document).ready(
    function () {
        $('#conten-crear').hide();
        $('#conten-editar').hide();

       // $('.btncrear')

        $('table').on('click', '.eliminar', function () {

            const resp = confirm('¿Esta seguro que quiere elimnarlo?')
            if (resp) {
                const fila = $(this).closest('tr');
                const codi = fila.data('id');


                sql = 'DELETE FROM users WHERE rowid=?';

                window.query(sql, [codi]).then(function (result) {
                    fila.remove();
                    toastr.success('Eliminado correctamente')
                    console.log('Eliminado correctamente');
                }, function (error) {
                    toastr.error('Error eliminando...', error);
                })

            }

        });


        sql = 'SELECT *, rowid FROM users';
        window.query(sql).then(function (result) {
            var items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];

                $('table tbody').append(
                    "<tr id='fila-"+ u['rowid'] + "'data-id='" + u['rowid'] + "' >\
                        <th>"+ u['rowid'] + "</th>\
                        <td class='td-nombre'>"+ u['nombres'] + "</td>\
                        <td class='td-sexo'>"+ u['sexo'] + "</td>\
                        <td class='td-tipo'>"+ u['tipo'] + "</td>\
                        <td class='td-usuario'>"+ u['usuario'] + "</td>\
                        <td class='td-password'>"+ u['password'] + "</td>\
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
            const sexo = tr.find('.td-sexo').text();
            const tipo = tr.find('.td-tipo').text();
            const usuario = tr.find('.td-usuario').text();
            const password = tr.find('.td-password').text();

            if (sexo == 'F') {
                document.getElementById('sexoFemeEdit').checked = true;
                document.getElementById('sexoMascEdit').checked = false;
            }else{
                document.getElementById('sexoMascEdit').checked = true;
                document.getElementById('sexoFemeEdit').checked = false;
            }

            $('#inputnombreEdit').val(nombre);
            $('#inputtipoEdit').val(tipo);
            $('#inputusuarioEdit').val(usuario);
            $('#inputpasswordEdit').val(password);

            $('#conten-editar').show('fast');
        })
        
        $('#formEditar').submit(function () {
            a = $('#inputnombreEdit').val();
            b = document.getElementById('sexoFemeEdit').checked ? 'F' : 'M'; 
            c = $('#inputtipoEdit').val();
            d = $('#inputusuarioEdit').val();
            e = $('#inputpasswordEdit').val();

            

            sql = 'UPDATE users SET nombres=?,sexo=?,tipo=?,usuario=?,password=? WHERE rowid=? ';

            window.query(sql, [a, b, c, d, e,fila_editantdo.data('id')]).then(function (result) {
                toastr.success('Usuario editado');
                fila_editantdo.find('.td-nombre').text(a);
                fila_editantdo.find('.td-sexo').text(b);
                fila_editantdo.find('.td-tipo').text(c);
                fila_editantdo.find('.td-usuario').text(d);
                fila_editantdo.find('.td-password').text(e);

                $('#conten-editar').hide();
                
            }, function (error) {
                toastr.error('No se pudo ingresar dato');
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
                $('#inputsexo').val('');
                $('#inputtipo').val('');
                $('#inputusuario').val('');
                $('#inputpassword').val('');
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
            b = document.getElementById('sexoFeme').checked ? 'F' : 'M'; 
            c = $('#inputtipo').val();
            d = $('#inputusuario').val();
            e = $('#inputpassword').val();


            sql = 'INSERT INTO users(nombres,sexo,tipo,usuario,password)VALUES(?,?,?,?,?)';

            window.query(sql, [a, b, c, d, e]).then(function (result) {
                toastr.success('Usuario creado con éxito');

                $('table tbody').append(
                    "<tr id='fila-" + result.insertId + "'data-id='" + result.insertId + "'>\
                        <th>"+ result.insertId + "</th>\
                        <td class='td-nombre'>"+ a + "</td>\
                        <td class='td-sexo'>"+ b + "</td>\
                        <td class='td-tipo'>"+ c + "</td>\
                        <td class='td-usuario'>"+ d + "</td>\
                        <td class='td-password'>"+ e + "</td>\
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