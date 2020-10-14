window.crearBaseDatos();

//Traemos todos los usuarios para verificar existentes
$(function () {


    $('#frmlogin').submit(function (e) {

        const usu = $('#usuarioInput').val();
        const pass = $('#passInput').val();
        sql = 'SELECT *, rowid FROM users WHERE usuario=? and password=?';
        window.query(sql, [usu, pass]).then(function (result) {
            
            if (result.length > 0) {

                const usuario = result[0]
                localStorage.setItem('usuario', JSON.stringify(usuario));

                window.location.href = '../../index.html'

            } else {
                toastr.error('Usuario incorrecto ')

            }
        })


        e.preventDefault();

    })


    sql = 'SELECT *, rowid FROM users'
    window.query(sql).then(function (result) {


        if (result.length == 0) {

            a = "admin"
            b = "admin"
            c = "admin"
            d = "123"
            sql = 'INSERT INTO users(nombres,tipo, sexo,usuario,password)VALUES(?,?,?,?,?)';

            window.query(sql, [a, b, 'Masculino', c, d]).then(function (result) {

                toastr.info('Usuario creado, inténtalo de nuevo');

            }, function (error) {
                toastr.error('Error al crear admin');
                console.log('Error al crear admin', error);
            })


        }

    })
})







