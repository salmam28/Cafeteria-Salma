window.crearBaseDatos();
$(document).ready(
    function () {

        var USER = JSON.parse(localStorage.usuario);

        const nombre = USER.nombres;
        const sexo = USER.sexo;
        const tipo = USER.tipo;
        const usuario = USER.usuario;
        const password = USER.password;

        $('#inputnombreEdit').val(nombre);
        $('#inputtipoEdit').val(tipo);
        $('#inputusuarioEdit').val(usuario);
        $('#inputpassword').val(password);

        
        if (sexo == 'F') {
            document.getElementById('sexoFeme').checked = true;
            document.getElementById('sexoMasc').checked = false;
        }else{
            document.getElementById('sexoMasc').checked = true;
            document.getElementById('sexoFeme').checked = false;
        }

        $('#btn-verpass').click(function () {
            const tipo = $("#inputpassword").attr('type');
            $("#inputpassword").attr('type', (tipo == 'text' ? 'password':'text'));
        })

        $('#formEditar').submit(function (e) {
            e.preventDefault();
            a = $('#inputnombreEdit').val();
            b = document.getElementById('sexoFeme').checked ? 'F' : 'M';
            c = $('#inputtipoEdit').val();
            d = $('#inputusuarioEdit').val();
            e = $('#inputpassword').val();
            const id = USER.rowid;


            sql = 'UPDATE users SET nombres=?,sexo=?,tipo=?,usuario=?,password=? WHERE rowid=? ';

            window.query(sql, [a, b, c, d, e, id]).then(function (result) {

            sql = 'SELECT *, rowid FROM users WHERE rowid=? ';

            window.query(sql, [id]).then(function (result) {


                const usuario = result[0]
                localStorage.setItem('usuario', JSON.stringify(usuario));
                
                toastr.success('Usuario editado');

            })
            }, function (error) {
                toastr.error('No se pudo ingresar dato');
                console.log('Dato ingresado', error);
            })


        })


    })