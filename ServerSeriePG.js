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
		
			serial.registerReadCallback(
				function(data){
					var view = new Uint8Array(data);
					//console.log("llegó:" + String.fromCharCode.apply(null, view));
					console.log("llegó:", view);
					
					for(var i=0; i<view.length; i++){
						var int_entrada = view[i];
						if(int_entrada<8){
							el_proximo_es_para = int_entrada;
						}else{
							if(id_nodo_proximo_char == -1) return;
							var sesion = _.findWhere(_this.sesiones, {idNodo: el_proximo_es_para});
							if(!sesion) {
								sesion = new NodoSesionSeriePG(el_proximo_es_para, {verbose: _this.verbose});
								_this.sesiones.push(sesion);
								Vx.conectarCon(sesion);
							}
							sesion.recibirIntSerie(int_entrada);
						}
					}
//					buffer_entrada_serie += String.fromCharCode.apply(null, view);
					
					
//					buffer_entrada_serie += String.fromCharCode.apply(null, view);					
//					var mensajes_en_buffer = buffer_entrada_serie.split('|');
//					if(mensajes_en_buffer.length>1){
//						var mensaje;
//						try{
//							mensaje = JSON.parse(mensajes_en_buffer[0]);
//						}catch(err){
//							if(_this.verbose) console.log("error al parsear:", mensajes_en_buffer[0]);
//						}
//						if(mensaje){
//							if(mensaje.idNodo){
//								var sesion = _.findWhere(_this.sesiones, {idNodo: mensaje.idNodo});
//								if(!sesion) {
//									sesion = new NodoSesionSeriePG(mensaje.idNodo, {verbose: _this.verbose});
//									_this.sesiones.push(sesion);
//									Vx.conectarCon(sesion);
//								}
//								sesion.recibirMensajeSerie(mensaje.msj);
//							}
//						}
//						buffer_entrada_serie = "";
//						for(var i=1; i<mensajes_en_buffer.length; i++){
//							buffer_entrada_serie+=mensajes_en_buffer[i] + "|";
//						}
//						buffer_entrada_serie = buffer_entrada_serie.substring(0,buffer_entrada_serie.length-2);
//					}						
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