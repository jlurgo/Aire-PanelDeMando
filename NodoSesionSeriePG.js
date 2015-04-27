/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

if(typeof(require) != "undefined"){
    var NodoNulo = require("./NodoNulo").clase;
}

var NodoSesionSeriePG = function(idNodo, opt){
	var _this = this;
	this.idNodo = idNodo;
    this.verbose = opt.verbose||false;
	this.vecino = new NodoNulo();
	if(this.verbose) console.log("conector serie " + this.idNodo + " creado");
	this.buffer_entrada_serie = "";
};

NodoSesionSeriePG.prototype.conectarCon = function(un_vecino){
	if(this.vecino === un_vecino) return;
    this.vecino = un_vecino;
	un_vecino.conectarCon(this);
};

NodoSesionSeriePG.prototype.desconectarDe = function(un_nodo){
    this.vecino = new NodoNulo();
    this.desconectarDe = function(){};
    
    un_nodo.desconectarDe(this);
    this.alDesconectar();
};

NodoSesionSeriePG.prototype.recibirMensaje = function(mensaje){  
	var _this = this;
	if(mensaje.tipoDeMensaje)
		if(mensaje.tipoDeMensaje=='Vortex.Filtro.Publicacion')
			return;
	var mensaje_str = JSON.stringify(mensaje) + String.fromCharCode(13);
	serial.write(
		mensaje_str,
		function(successMessage) {
    		if(_this.verbose) console.log("conector serie " + _this.idNodo + " envió mensaje por el puerto serie:" + mensaje_str);
		},
		function(err){
			if(_this.verbose) console.log("error al enviar mensaje por conector serie:" + _this.idNodo, err, mensaje_str);
		}
	);	
};

NodoSesionSeriePG.prototype.recibirIntSerie = function(int_recibido){  
	if(int_recibido != 13) this.buffer_entrada_serie += String.fromCharCode.apply(int_recibido);
	else {
		var mensaje;
		try{
			mensaje = JSON.parse(this.buffer_entrada_serie);
		}catch(err){
			if(_this.verbose) console.log("error al parsear en nodo " + this.idNodo +":", this.buffer_entrada_serie);
		}
		if(mensaje){				
			this.recibirMensajeSerie(mensaje.msj);
		}
		this.buffer_entrada_serie = "";
	}
};

NodoSesionSeriePG.prototype.recibirMensajeSerie = function(mensaje){  
	var _this = this;
    if(this.verbose) console.log("conector serie " + _this.idNodo + " recibió mensaje del puerto serie:",  mensaje);
	this.vecino.recibirMensaje(mensaje, this);
};

if(typeof(require) != "undefined"){
	exports.clase = NodoConectorSeriePhoneGap;
}
