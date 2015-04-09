var ControlAire = function(id){	
	var ui = $("#plantillas .control_aire").clone();
	var boton = ui.find(".boton_encendido");
	var led = ui.find(".led");
	led.attr("id", "led_" + id);
	ui.attr("id", "aire_" + id);
	
	var aire_remoto = {
		encendido: false
	};
	
	Vx.when({
		idAire:id,
		tipoDeMensaje: "Aire.apagar"
	},function(){
		boton.removeClass('on');
		aire_remoto.encendido = false;
	});
	
	Vx.when({
		idAire:id,
		tipoDeMensaje: "Aire.encender"
	},function(){
		boton.addClass('on');
		aire_remoto.encendido = true;
	});
	
	boton.on('click', function(){
		if(aire_remoto.encendido) {			
			Vx.send({
				idAire:id,
				tipoDeMensaje: "Aire.apagar"
			});
		}
		else{
			Vx.send({
				idAire:id,
				tipoDeMensaje: "Aire.encender"
			});
		}
	});
	
	$("#panel_de_mando").append(ui);	
	$("#panel_de_mando #aire_" + id + " .indicador_temperatura").sGlide({
		height		: 20,
		image		: 'sGlide/img/knob.png',
		startAt		: 70,
		colorShift	: ['rgb(63, 255, 255)', 'rgb(244, 109, 60)'],
	});
};
