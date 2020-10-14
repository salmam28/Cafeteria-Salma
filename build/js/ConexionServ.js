window.crearBaseDatos = function () {
    
    var db;


    db = window.openDatabase("Once2020.db", '1', 'Proyecto 2020', 1024 * 1024 * 49);


    sqlUsers = "CREATE TABLE IF NOT EXISTS users (id integer," +
        "nombres varchar(100)  NOT NULL collate nocase," +
        "apellidos varchar(100)  DEFAULT NULL collate nocase," +
        "sexo varchar(1)  NOT NULL," +
        "fecha_nac date DEFAULT NULL," +
        "documento varchar(100) DEFAULT NULL collate nocase,"+
        "tipo varchar(100)  NOT NULL collate nocase," + 
        "usuario varchar(100)  DEFAULT NULL collate nocase,"+
        "password varchar(100)  DEFAULT NULL collate nocase)";

    sqlCliente = "CREATE TABLE IF NOT EXISTS clientes (id integer," +
        "nombres varchar(100)  NOT NULL collate nocase," +
        "apellidos varchar(100)  DEFAULT NULL collate nocase," +
        "sexo varchar(1)  NOT NULL," +
        "documento varchar(100) DEFAULT NULL collate nocase,"+ 
        "acudiente varchar(255)  DEFAULT NULL collate nocase,"+
        "telefono varchar(200)  DEFAULT NULL collate nocase)";

    sqlProductos = "CREATE TABLE IF NOT EXISTS productos (id integer," +
        "nombre varchar(255)  NOT NULL collate nocase," +
        "abreviatura varchar(100)  DEFAULT NULL collate nocase," +
        "precio integer DEFAULT '0'," +
        "costo integer  DEFAULT '0'," +
        "descripcion varchar(255) DEFAULT NULL," +
        "proveedor varchar(255) DEFAULT NULL collate nocase,"+
        "cell_proveedor varchar(255) DEFAULT NULL collate nocase)";

    sqlVentas = "CREATE TABLE IF NOT EXISTS ventas (id integer," +
        "usuario_id integer DEFAULT NULL," +
        "fecha varchar(255) DEFAULT NULL," +
        "cliente_id integer DEFAULT NULL," +
        "descripcion varchar(255) DEFAULT NULL," +
        "pago varchar(255) DEFAULT NULL collate nocase)";


    sqlVentaDetalle = "CREATE TABLE IF NOT EXISTS venta_detalle (id integer," +
        "venta_id integer NOT NULL," +
        "producto_id integer NOT NULL," +
        "cantidad integer DEFAULT '1'," +
        "precio integer DEFAULT '0')";



    window.db = db;


    window.query(sqlUsers).then(function () {
        console.log('Tabla users creada.');
    }, function () {
        console.log('Error creando la tabla users');
    })

    window.query(sqlCliente).then(function () {
        console.log('Tabla Cliente creada.');
    }, function () {
        console.log('Error creando la tabla Cliente');
    })
  
    window.query(sqlProductos).then(function () {
        console.log('Tabla productos creada.');
    }, function () {
        console.log('Error creando la tabla productos');
    })
    window.query(sqlVentas).then(function () {
        console.log('Tabla Ventas creada.');
    }, function () {
        console.log('Error creando la tabla Ventas');
    })
    window.query(sqlVentaDetalle).then(function () {
        console.log('Tabla VentaDetalle creada.');
    }, function () {
        console.log('Error creando la tabla VentaDetalle');
    })
}



window.query = function (sql, parms) {
    parms           = parms || [];
    var diferido    = $.Deferred()

    window.db.transaction(function (tx) {
        tx.executeSql(sql, parms, function (tx, result) {

            if (sql.substring(0,6).toLowerCase() == 'insert' || sql.substring(0,6).toLowerCase() == 'update') {
                diferido.resolve(result);
            };


            var items = [];
            for (i = 0, l = result.rows.length; i < l; i++) {
              items.push(result.rows.item(i));
            }
            
            diferido.resolve(items);
            
        }, function(tx,error){
            diferido.reject(error.message, tx);
        })
    })

    return diferido.promise();
}