window.crearBaseDatos();
$(document).ready(function () {

    sql = 'SELECT rowid, * FROM clientes'

    window.query(sql).then(function (result) {

      

    },function (error) {
            toastr.error('Error,eliminando...');
            console.log('Error,eliminando...', error);
        }
    );

    

});