var onDeviceReady = function() {  
	DivConsola.start();
	console.log("Arrancando..");
	Vx.conectarCon(new NodoConectorSocket('https://server-vortex.herokuapp.com'));
	var server_serie = new ServerSeriePG({verbose:true});
	
	var control_1 = new ControlAire(1);
	var control_2 = new ControlAire(2);
	
	var errorCallback = function(message) {
		console.log('Error: ' + message);
	};
};

$(document).ready(function() {  
    //toda esta garcha es para detectar si la aplicacion esta corriendo en un celular o en una pc.
    //En el celular para arrancar la app hay que esperar al evento deviceReady, en la pc solo al documentReady
    window.isphone = false;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        window.isphone = true;
    }

    if(window.isphone) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
//		serial = {
//			requestPermission: function(success){
//				success("ok");
//			},
//			close: function(success){
//				success("ok");
//			},
//			open : function(opt, success){
//				success("ok");
//			},
//			registerReadCallback: function(cb){
//				setTimeout(function(){
//					cb('{"idNodo":1,"msj":{"tipoDeMensaje":"Vortex.Filtro.Publicacion","filtro":{"tipo":"OR","filtros":[{"tipo":"EX","ejemplo":{"tipoDeMensaje":"Aire.encender","idAire":1}},{"tipo":"EX","ejemplo":{"tipoDeMensaje":"Aire.apagar","idAire":1}}]}}}|');
//				}, 1000)
//			},
//			write: function(msg, success){
//				success("ok");
//			}
//		}
        onDeviceReady();
    }
});

