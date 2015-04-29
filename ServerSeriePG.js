var ServerSeriePG = function(opt){
	this.sesiones = [];
	this.verbose = opt.verbose||false;
	this.solicitarPermisoYAbrirPuertoSerie();
};

ServerSeriePG.prototype.solicitarPermisoYAbrirPuertoSerie = function(){
	var _this = this;
	serial.requestPermission(
		 function(successMessage) {
			if(_this.verbose) console.log("permiso concedido para usar puerto serie:", successMessage);
			serial.close(function(){
				if(_this.verbose) console.log("puerto serie cerrado");
				_this.abrirPuertoSerie();
			}, function(err){
				if(_this.verbose) console.log("error al cerrar puerto serie");
				_this.solicitarPermisoYAbrirPuertoSerie();
			});
		},
		function(err){
			if(_this.verbose) console.log("error al pedir permiso para usar puerto serie:", err);
			_this.solicitarPermisoYAbrirPuertoSerie();
		}
	);
};
	
ServerSeriePG.prototype.abrirPuertoSerie = function(){
	var _this = this;
	serial.open ({baudRate: 115200},
		function(successMessage) {
			if(_this.verbose) console.log("puerto serie abierto");

			var buffer_entrada_serie = "";
			var id_nodo_proximo_char = -1;
			var sesion_que_recibe_proximo_char = {recibirIntSerie: function(){}};
		
			serial.registerReadCallback(
				function(data){
					var view = new Uint8Array(data);
					//console.log("llegó:" + String.fromCharCode.apply(null, view));					
					
					for(var i=0; i<view.length; i++){
						var int_entrada = view[i];
						//console.log("llegó:", int_entrada);
						if(int_entrada<10){
							sesion_que_recibe_proximo_char = _.findWhere(_this.sesiones, {idNodo: int_entrada});
							if(!sesion_que_recibe_proximo_char) {
								sesion = new NodoSesionSeriePG(int_entrada, {verbose: _this.verbose});
								_this.sesiones.push(sesion);
								Vx.conectarCon(sesion);
							}
						}else{
							sesion.recibirIntSerie(int_entrada);
						}	
					}					
				},
				function(err){
					if(_this.verbose) console.log("error al registrar callback:", err);
					_this.solicitarPermisoYAbrirPuertoSerie();
				}
			);
		},
		function(err){
			if(_this.verbose) console.log("error al abrir puerto serie:", err);
			_this.solicitarPermisoYAbrirPuertoSerie();
		}
	);
};