/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
    var NodoNulo = require("./NodoNulo").clase;
}

var NodoConectorSeriePG = function(opt){
	var _this = this;
    this.verbose = opt.verbose||false;
	if(serial===undefined) return;
	serial.requestPermission(
		 function(successMessage) {
			if(this.verbose) console.log("permiso concedido para usar puerto serie:", successMessage);
			serial.close(function(){
				if(this.verbose) console.log("puerto serie cerrado");
				_this.abrirPuertoSerie();
			}, function(err){
				if(this.verbose) console.log("error al cerrar puerto serie");
				_this.abrirPuertoSerie();
			});
		},
		function(err){
			if(this.verbose) console.log("error al pedir permiso para usar puerto serie:", err);
			_this.abrirPuertoSerie();
		}
	);
};

NodoConectorSeriePG.prototype.conectarCon = function(un_vecino){
	if(this.vecino === un_vecino) return;
    this.vecino = un_vecino;
	un_vecino.conectarCon(this);
};

NodoConectorSeriePG.prototype.desconectarDe = function(un_nodo){
    this.vecino = new NodoNulo();
    this.desconectarDe = function(){};
    
    un_nodo.desconectarDe(this);
    this.alDesconectar();
};

NodoConectorSeriePG.prototype.recibirMensaje = function(mensaje){  
	if(mensaje.tipoDeMensaje)
		if(mensaje.tipoDeMensaje=='Vortex.Filtro.Publicacion')
			return;
	this.enviarMensajeSerie(mensaje);
};

NodoConectorSeriePG.prototype.enviarMensajeSerie = function(mensaje){  
	var _this = this;
    if(this.verbose) console.log("conector envia mensaje por serie:", mensaje + '|');
	serial.write(
		JSON.stringify(mensaje) + '|',
		function(successMessage) {
			if(_this.verbose) console.log("enviado: ", mensaje + '|');
		},
		function(err){
			if(_this.verbose) console.log("error al enviar por puerto serie:", err);
		}
	);	
};

NodoConectorSeriePG.prototype.recibirMensajeSerie = function(mensaje_str){  
	var _this = this;
    if(this.verbose) console.log("conector recibe mensaje por serie:", mensaje_str);
	var mensaje;
	try{
		mensaje = JSON.parse(mensaje_str);
	}catch(err){
		if(_this.verbose) console.log("error al parsear:", mensaje_str);
	}
	if(!mensaje) return;
	this.vecino.recibirMensaje(mensaje, this);
};

NodoConectorSeriePG.prototype.abrirPuertoSerie = function(){
	var _this = this;
	serial.open ({baudRate: 115200},
		function(successMessage) {
			if(_this.verbose) console.log("puerto serie abierto");

			var buffer_entrada_serie = "";
			serial.registerReadCallback(
				function(data){
					var view = new Uint8Array(data);
					buffer_entrada_serie += String.fromCharCode.apply(null, view);
					var mensajes_en_buffer = buffer_entrada_serie.split('|');
					if(mensajes_en_buffer.length>1){
						_this.recibirMensajeSerie(mensajes_en_buffer[0]);
						buffer_entrada_serie = "";
						for(var i=1; i<mensajes_en_buffer.length; i++){
							buffer_entrada_serie+=mensajes_en_buffer[i] + "|";
						}
						buffer_entrada_serie = buffer_entrada_serie.substring(0,buffer_entrada_serie.length-2);
					}						
				},
				function(err){
					if(_this.verbose) console.log("error al registrar callback:", err);
				}
			);
		},
		function(err){
			if(_this.verbose) console.log("error al abrir puerto serie:", err);
		}
	);
};
	
if(typeof(require) != "undefined"){
	exports.clase = NodoConectorSeriePhoneGap;
}
