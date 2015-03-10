var onDeviceReady = function() {  
	DivConsola.start();
	console.log("Arrancando..");
//	vx.start({verbose:true});
//    
//    vx.conectarPorWebSockets({
//        url:'https://router-vortex.herokuapp.com'
//    }); 
	serial.requestPermission(function(){
		console.log("permiso concedido");
		serial.open({}, function(){}, function(){});
	}, function error(err){
		console.log("error al pedir permiso para serie");
	});
	
	var errorCallback = function(message) {
		console.log('Error: ' + message);
	};

	serial.requestPermission(
		function(successMessage) {
			console.log("permiso concedido para usar puerto serie");
			serial.open(
				{baudRate: 9600},
				function(successMessage) {
					$("#btn_enviar").click(function(){
						serial.write(
							'1',
							function(successMessage) {
								console.log(successMessage);
							},
							function(err){
								console.log("error al enviar por puerto serie:", err);
							}
						);	
					});
					
					serial.registerReadCallback(
						function(data){
							var view = new Uint8Array(data);
							console.log("recibido por puerto serie:", view);
						},
						function(err){
							console.log("error al registrar callback:", err);
						}
					);
				},
				function(err){
					console.log("error al abrir puerto serie:", err);
				}
			);
		},
		function(err){
			console.log("error al pedir permiso para usar puerto serie:", err);
		}
	);
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
        onDeviceReady();
    }
});

