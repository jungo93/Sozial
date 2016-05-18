											///////////////// routing /////////////////
/// configuration of the routing
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

/// the principal route
Router.route('/', function () {
	this.render('principal', {
		to:"main"
	});
});

/// the configuration option route
Router.route('/perfil', function () {
	this.render('perfil', {
		to:"main"
	});
});

/// the festival creation option route
Router.route('/creator', function () {
	this.render('creator', {
		to:"main"
	});
});

/// route to access to an specific page of a user profile
Router.route('/perfil/:username', function () {
	this.render('navbar', {
		to:"navbar"
	});
	this.render('infoPerfil', {
		to:"main",
		data:function(){
			return Meteor.users.findOne({username:this.params.username});
		}
	});
});

/// route to access to an specific page of a festival
Router.route('/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('festival', {
    to:"main", 
    data:function(){
      return Festivals.findOne({_id:this.params._id});
	}
  });
});




											///////////////// configuration /////////////////
/// accounts configuration
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

/// access to read the publish things for new attributes on users
Deps.autorun(function(){
	Meteor.subscribe('userData');
});




											///////////////// scroll /////////////////
/// infiniscroll
Session.set("festivalLimit", 8);
lastScrollTop = 0;
$(window).scroll(function(event){
	// test if we are near the bottom of the window
	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		// where are we in the page? 
		var scrollTop = $(this).scrollTop();
		// test if we are going down
		if (scrollTop > lastScrollTop){
			// yes we are heading down...
			Session.set("festivalLimit", Session.get("festivalLimit") + 4);
		}
		lastScrollTop = scrollTop;
	}
})




											///////////////// template helpers /////////////////
/// helper function to get the username that has initiated the session
Template.principal.helpers({
	username:function(){
		return Meteor.user().username;
	},
	contCreados:function(){
		return Meteor.user().festivals_created.length;
	},
	contAsistidos:function(){
		return Meteor.user().festivals_assisted.length;
	},
	contTotal:function(){
		return Festivals.find({}, {}).count();
	},
	contSiguiendo:function(){
		return Meteor.user().following.length;
	},
	contSeguidores:function(){
		return Meteor.user().followers.length;
	},
	contGente:function(){
		return Meteor.users.find({}, {}).count()-1;
	}
});

/// helper function that returns all users
Template.people_list.helpers({
	user:function(){
		var users = Meteor.users.find({}, {});
		var usersFinal = [];
		users.forEach(function (user) {
			if(user.username != Meteor.user().username){	
				usersFinal.push(user);
			}
		});
		return usersFinal;
	}
});

/// helper function that returns the people follows the current user
Template.followers_list.helpers({
	user:function(){
		var users = Meteor.user().followers;
		var user = new Array();
		var cont = 0;
		for(var i=0; i<users.length; i++){
			if(Meteor.users.findOne({username:users[i]})){
				user[cont] = Meteor.users.findOne({username:users[i]});
				cont++;
			}
		}
		return user;
	}
});

/// helper function that returns the people the current user is following
Template.following_list.helpers({
	user:function(){
		var users = Meteor.user().following;
		var user = new Array();
		var cont = 0;
		for(var i=0; i<users.length; i++){
			if(Meteor.users.findOne({username:users[i]})){
				user[cont] = Meteor.users.findOne({username:users[i]});
				cont++;
			}
		}
		return user;
	}
});

/// helper function that returns all available festivals
Template.festival_list.helpers({
	festivals:function(){
		var festivals = Festivals.find({}, {});
		festivalsFinal = new Array();
		// introduce only the festivals of the future
		festivals.forEach(function (festival) {
			if(festival.firstDay>new Date())
				festivalsFinal.push(festival);
		});
		
		festivalsFinal.sort(function (a, b) {
			return (a.firstDay - b.firstDay)
		})
		return festivalsFinal;
	}
});

/// helper function that returns created festivals by the user
Template.creatorfestival_list.helpers({
	festivals:function(){
		var festivals = Meteor.user().festivals_created;
		var fest = new Array();
		var cont = 0;
		for(var i=0; i<festivals.length; i++){
			if(Festivals.findOne({name:festivals[i]})){
				fest[cont] = Festivals.findOne({name:festivals[i]});
				cont++;
			}
		}
		festivalsFinal = new Array();
		fest.forEach(function (festival) {
			festivalsFinal.push(festival);
		});
		
		festivalsFinal.sort(function (a, b) {
			return (a.firstDay - b.firstDay)
		})
		return festivalsFinal;
	}
});

/// helper function that returns the festival user will assist
Template.myfestival_list.helpers({
	festivals:function(){
		var festivals = Meteor.user().festivals_assisted;
		var fest = new Array();
		var cont = 0;
		for(var i=0; i<festivals.length; i++){
			if(Festivals.findOne({name:festivals[i]})){
				fest[cont] = Festivals.findOne({name:festivals[i]});
				cont++;
			}
		}
		festivalsFinal = new Array();
		fest.forEach(function (festival) {
			if(festival.firstDay>new Date())
				festivalsFinal.push(festival);
		});
		
		festivalsFinal.sort(function (a, b) {
			return (a.firstDay - b.firstDay)
		})
		return festivalsFinal;
	}
});

/// helper to change the format of Date
Template.festival_item.helpers({
	getDate:function(date){
		return date.toLocaleDateString("es-es");
	},
	getPhoto:function(photo){
		if(photo==""){
			return "/img/noimg.gif";
		}else{
			return photo;
		}
	}
});

/// helper to change the format of Date
Template.festival.helpers({
	getDate:function(date){
		return date.toLocaleDateString("es-es");
	},
	deleteFest:function(){
		var festivals = Meteor.user().festivals_created;
		var created = false;
		for(var i=0; i<festivals.length; i++){
			if(festivals[i] == this.name){
				created = true;
			}
		}
		if(created){
			return true;
		}
		else{
			return false;
		}
	},
	getPhoto:function(photo){
		if(photo==""){
			return "/img/noimg.gif";
		}else{
			return photo;
		}
	}
});

/// helper to change the format of Date
Template.infoPerfil.helpers({
	getEmail:function(username){
		var user = Meteor.users.findOne({username:username});
		return user.emails[0].address;
	},
	getImage:function(image){
		if(image==""){
			return "/img/noimg.gif";
		}else{
			return image;
		}
	}
});




											///////////////// template events /////////////////
Template.principal.events({
	///find following
	"click .js-find-following":function(event){
		$("#find_following").show('slow');
		$("#notFindFollowing").show();
		$("#findFollowing").hide();
	},
	"click .js-notFind-following":function(event){
		$("#find_following").hide('slow');
		$("#notFindFollowing").hide();
		$("#findFollowing").show();
	},
	///find followers
	"click .js-find-followers":function(event){
		$("#find_followers").show('slow');
		$("#notFindFollowers").show();
		$("#findFollowers").hide();
	},
	"click .js-notFind-followers":function(event){
		$("#find_followers").hide('slow');
		$("#notFindFollowers").hide();
		$("#findFollowers").show();
	},
	///find people
	"click .js-find-people":function(event){
		$("#find_people").show('slow');
		$("#notFindPeople").show();
		$("#findPeople").hide();
	},
	"click .js-notFind-people":function(event){
		$("#find_people").hide('slow');
		$("#notFindPeople").hide();
		$("#findPeople").show();
	}
});

///count the number os people will assist to a festival
Template.festival.events({
	"click .js-asist":function(event){
		var festival_id = this._id;
		var name = this.name;
		var capacity = this.capacity;
		var assistants = this.assistants;

		//verify that the maximun number of people will assist
		if(capacity == assistants){
			$("#maxCapacity").show('slow');
			return false;
		}

		//verify the user hasn't assist yet
		var encontrado = false;
		for(var i=0; i<Meteor.user().festivals_assisted.length; i++){
			if(Meteor.user().festivals_assisted[i]==name) encontrado = true;
		}
		if(encontrado){
			alert("Ya has confirmado tu asistencia!");
			$("#asist").hide('slow');
			$("#notasist").show('slow');
			return false;
		}else{
			Festivals.update({_id:festival_id}, 
                {$inc: {assistants:1}});
			Meteor.users.update(Meteor.user()._id, {$push: {festivals_assisted: this.name}});
			$("#asist").hide('slow');
			$("#notasist").show('slow');
			return false;// prevent the button from reloading the page
		}
	},
	"click .js-notasist":function(event){
		var festival_id = this._id;
		var name = this.name;
		
		//verify the user has assist yet
		var encontrado = false;
		for(var i=0; i<Meteor.user().festivals_assisted.length; i++){
			if(Meteor.user().festivals_assisted[i]==name) encontrado = true;
		}
		if(encontrado){
			Festivals.update({_id:festival_id}, 
                {$inc: {assistants:-1}});
			Meteor.users.update(Meteor.user()._id, {$pull: {festivals_assisted: this.name}});
			$("#notasist").hide('slow');
			$("#asist").show('slow');
			$("#maxCapacity").hide('slow');
			return false;// prevent the button from reloading the page
		}else{
			alert("No habías asistido!");
			$("#notasist").hide('slow');
			$("#asist").show('slow');
			return false;
		}
	},
	"click .js-delete-festival":function(event){
		var festival_id = this._id;
		
		//Eliminar de la base de datos
		Festivals.remove({_id:festival_id});
		
		//Eliminar de entre los festivales creados por el usuario
		Meteor.users.update(Meteor.user()._id, {$pull: {festivals_created: this.name}});
		
		alert("¡Festival eliminado!");
		return true;
	}
});

///change the information of the information of the festival
Template.perfil.events({
	"click .js-save":function(event){
		$('#notSameEmail').hide();
		$('#notSamePassword').hide();
		
		var _id = Meteor.user()._id;
		
		var username = "";
		if(document.getElementById('nombreusuario').value == ""){
			username = Meteor.user().username;
		}else{
			username = document.getElementById('nombreusuario').value;
		}
		
		if(document.getElementById('email').value != document.getElementById('emailRepetido').value){
			$('#notSameEmail').show('slow');
			return false;
		}
		var email = "";
		if(document.getElementById('email').value == ""){
			email = Meteor.user().email;
		}else{
			email = document.getElementById('email').value;
		}
		
		if(document.getElementById('password').value != document.getElementById('passwordRepetido').value){
			$('#notSamePassword').show('slow');
			return false;
		}
		var password = "";
		if(document.getElementById('password').value == ""){
			password = Meteor.user().password;
		}else{
			password = document.getElementById('password').value;
		}

		var nombre = "";
		if(document.getElementById('nombre').value == ""){
			nombre = Meteor.user().name;
		}else{
			nombre = document.getElementById('nombre').value;
		}
		
		var apellido = "";
		if(document.getElementById('apellido').value == ""){
			apellido = Meteor.user().surname;
		}else{
			apellido = document.getElementById('apellido').value;
		}
		
		var nacimiento = "";
		if(document.getElementById('dia').value == ""){
			nacimiento = Meteor.user().birthday;
		}else{
			nacimiento = document.getElementById('dia').value
		}
		
		var sexo = "";
		if(document.getElementById('sexo').value == ""){
			sexo = Meteor.user().gender;
		}else{
			sexo = document.getElementById('sexo').value;
		}
		
		var residencia = "";
		if(document.getElementById('residencia').value == ""){
			residencia = Meteor.user().place;
		}else{
			residencia = document.getElementById('residencia').value;
		}
		
		var estiloMusica = "";
		if(document.getElementById('estilo').value == ""){
			estiloMusica = Meteor.user().music_style;
		}else{
			estiloMusica = document.getElementById('estilo').value;
		}

		var foto = "";
		if(document.getElementById('foto').value == ""){
			document.getElementById('foto');
			foto = Meteor.user().image;
		}else{
			foto = document.getElementById('foto').value;
		}
		
		Meteor.users.update(_id, {$set: {username:username, email:email, password:password, name:nombre, surname:apellido, birthday:nacimiento, gender:sexo, place:residencia, music_style:estiloMusica, image:foto}});
        
        alert("¡Datos actualizados!");
		return true;// prevent the button from reloading the page

	}
});

///save the information of a new festival
Template.creator.events({
	"click .js-create-calendar":function(event){
		
		// verify that some data is introduced
		if(diaInicio.value=="" || diaFin.value==""){
			$("#notDates").show('slow');
			return false;
		}
		else{
			$("#notDates").hide('slow');
			$("#calendar_create").show('slow');
			$("#create").hide();
			$("#notcreate").show();
		}
	},
	"click .js-notcreate-calendar":function(event){
		$("#calendar_create").hide('slow');
		$("#calendar_create_2").hide('slow');
		$("#create").show();
		$("#notcreate").hide();
		$("#propuesta").empty();
		$("#advise").hide();
	},
	"click .js-number-calendar":function(event){
		$("#calendar_create").hide();
		$("#calendar_create_2").show('slow');
		
		//por si previamente se han introducido datos en la etiqueta, se eliminan
		$("#grupos").empty();
		$("#horarios").empty();
		$("#escenarios").empty();
		
		//generar todos los input indicados para los grupos
		var groupElement = document.getElementById('grupos');
		for(var i = 0; i<document.getElementById('numberGroups').value; i++){
			var input = document.createElement("input");
			input.setAttribute("type", "text");
			input.setAttribute("size", "40");
			input.setAttribute("placeholder", "Nombre del grupo...");
			input.setAttribute("id", "groupName"+(i));
			groupElement.appendChild(input);
			var val = document.createElement("input");
			val.setAttribute("type", "number");
			val.setAttribute("min", "0");
			val.setAttribute("max", "9");
			val.setAttribute("id", "valGroup"+(i));
			groupElement.appendChild(val);
			var p = document.createElement("p");
			groupElement.appendChild(document.createElement("p"));
		}
		
		//generar todos los input indicados para los horarios
		var horarioElement = document.getElementById('horarios');
		for(var i = 0; i<document.getElementById('numberHorarios').value; i++){
			var input = document.createElement("input");
			input.setAttribute("type", "time");
			input.setAttribute("size", "40");
			input.setAttribute("placeholder", "Horario...");
			input.setAttribute("id", "horarioName"+(i));
			horarioElement.appendChild(input);
			var val = document.createElement("input");
			val.setAttribute("type", "number");
			val.setAttribute("min", "0");
			val.setAttribute("max", "9");
			val.setAttribute("id", "valHorario"+(i));
			horarioElement.appendChild(val);
			var p = document.createElement("p");
			horarioElement.appendChild(document.createElement("p"));
		}
		
		//generar todos los input indicados para los escenarios
		var escenariosElement = document.getElementById('escenarios');
		for(var i = 0; i<document.getElementById('numberEscenarios').value; i++){
			var input = document.createElement("input");
			input.setAttribute("type", "text");
			input.setAttribute("size", "40");
			input.setAttribute("placeholder", "Nombre del escenario...");
			input.setAttribute("id", "escenarioName"+(i));
			escenariosElement.appendChild(input);
			var val = document.createElement("input");
			val.setAttribute("type", "number");
			val.setAttribute("min", "0");
			val.setAttribute("max", "9");
			val.setAttribute("id", "valEscenario"+(i));
			escenariosElement.appendChild(val);
			var p = document.createElement("p");
			escenariosElement.appendChild(document.createElement("p"));
		}
	},
	"click .js-new-calendar":function(event){
		
		//comprobar que se han metido todos los elementos
		var metidos = true;
		for(var i=0; i<document.getElementById('numberGroups').value; i++){
			if(document.getElementById('groupName'+(i)).value=="" || document.getElementById('valGroup'+(i)).value==""){
				metidos=false;
			}
		}
		for(var i=0; i<document.getElementById('numberHorarios').value; i++){
			if(document.getElementById('horarioName'+(i)).value=="" || document.getElementById('valHorario'+(i)).value==""){
				metidos=false;
			}
		}
		for(var i=0; i<document.getElementById('numberEscenarios').value; i++){
			if(document.getElementById('escenarioName'+(i)).value=="" || document.getElementById('valEscenario'+(i)).value==""){
				metidos=false;
			}
		}
		
		if(!metidos){
			$("#notDataGenerator").show('slow');
			return false;
		}
		
		else{
			$("#calendar_create_2").hide();
			$("#notDataGenerator").hide();
			$("#advise").show();
			
			//generar una propuesta
			var propuestaElement = document.getElementById('propuesta');

			var tabla = document.createElement("table");
			var tblBody = document.createElement("tbody");
	
			tabla.setAttribute("border", "2");
			tabla.setAttribute("style", "width:70%");
			tabla.setAttribute("align", "center");
		
			//calcular número de días entre dos fechas
			var numDias = 0;
			var fechaInicio = document.getElementById('diaInicio').value;
			var fechaFin = document.getElementById('diaFin').value;
	
			if (fechaInicio.indexOf("-") != -1) {
				fechaInicio = fechaInicio.split("-");
			} else {
				numDias = 0;
			}

			if (fechaFin.indexOf("-") != -1) {
				fechaFin = fechaFin.split("-");
			} else {
				numDias = 0;
			} 

			if (parseInt(fechaInicio[0], 10) >= 1000) {
				var sDate = new Date(fechaInicio[0]+"/"+fechaInicio[1]+"/"+fechaInicio[2]);
			} else if (parseInt(fechaInicio[2], 10) >= 1000) {
				var sDate = new Date(fechaInicio[2]+"/"+fechaInicio[0]+"/"+fechaInicio[1]);
			} else { 
				numDias = 0; 
			}
	   
			if (parseInt(fechaFin[0], 10) >= 1000) { 
				var eDate = new Date(fechaFin[0]+"/"+fechaFin[1]+"/"+fechaFin[2]);
			} else if (parseInt(fechaFin[2], 10) >= 1000) {
				var eDate = new Date(fechaFin[2]+"/"+fechaFin[0]+"/"+fechaFin[1]);
			} else {
				numDias = 0;
			}
			var one_day = 1000*60*60*24;
			var numDias = Math.abs(Math.ceil((sDate.getTime()-eDate.getTime())/one_day));

			//almacenar todos los grupos, horarios y escenarios, junto a sus puntuaciones, en un array
			var grupos = new Array(document.getElementById('numberGroups').value);
			var horarios = new Array(document.getElementById('numberHorarios').value);
			var horariosAux = new Array(document.getElementById('numberHorarios').value);//para reordenar la tabla
			var horariosIntro = new Array(document.getElementById('numberHorarios').value);//para obtener el orden en el que se han introducido los horarios en la tabla (la primera vez)
			var escenarios = new Array(document.getElementById('numberEscenarios').value*(numDias+1));
			
			for(var i=0; i<document.getElementById('numberGroups').value; i++){
				grupos[i] = document.getElementById('groupName'+(i)).value + "|" + document.getElementById('valGroup'+(i)).value;
			}
			
			for(var i=0; i<document.getElementById('numberHorarios').value; i++){
				horarios[i] = document.getElementById('horarioName'+(i)).value + "|" + document.getElementById('valHorario'+(i)).value;
				horariosAux[i] = document.getElementById('horarioName'+(i)).value;
			}

			var n = 0;
			for(var i=0; i<document.getElementById('numberEscenarios').value; i++){
				for(var j=0; j<numDias+1; j++){
					escenarios[n] = document.getElementById('escenarioName'+(i)).value + "|" + document.getElementById('valEscenario'+(i)).value + "|" + j;
					n = n+1;
				}
			}
			
			//almacenar las fechas, de forma ordenada, en un array
			var fechas = new Array(numDias+1);
			fechaInicio = new Date(fechaInicio);
			fechaFin = new Date(fechaFin);
			f = fechaInicio;
			for(var i=0; i<numDias+1; i++){
				if(i==0){
					fechas[i] = fechaInicio;
				}
				else if(i==numDias){
					fechas[i] = fechaFin;
				}
				else{
					f = new Date(f.getTime() + 24*60*60*1000);
					fechas[i] = f;
				}
			}

			var numG = parseInt(document.getElementById('numberGroups').value);
			var numH = parseInt(document.getElementById('numberHorarios').value);
			var numE = parseInt(document.getElementById('numberEscenarios').value)*(numDias+1);
			
			// Crea las celdas
			for (var i = 0; i < parseInt(document.getElementById('numberHorarios').value)+1; i++) {
				// Crea las hileras de la tabla
				var hilera = document.createElement("tr");
				for (var j = 0; j < numDias+2; j++) {
					var celda = document.createElement("td");
					
					// Variables parar colocar los datos en la tabla
					var textoHorario = "";
					var textoGrupo = "";
					var textoEscenario = "";
					var s = -1;
					var num = 0;
					
					
					if(i==0 && j==0){
						var textoCelda = document.createTextNode(" ");
					}
					else if(i==0){
						var textoCelda = document.createTextNode(fechas[i].toLocaleDateString("es-es"));
						fechas.splice(0,1);
					}
					// En la primera columna se introducen los nombres de los horarios
					else if(j==0){
						for(var n=0; n<numH; n++){
							var d = horarios[n].split("|");
							if(d[1]>s){
								textoHorario = d[0];
								num = n;
								s = d[1];
							}
						}
						var textoCelda = document.createTextNode(textoHorario);
						
						horarios.splice(num,1);
						horariosIntro[i-1] = textoHorario;
						numH = numH-1;
					}
					
					// En las otras columnas se introducen los nombres de los grupos y los escenarios asociados
					else{
						// Introducir el grupo correcto en la celda
						for(var n=0; n<numG; n++){
							var d = grupos[n].split("|");
							if(d[1]>s){
								textoGrupo = d[0];
								num = n;
								s = d[1];
							}
						}
					
						//Borrar el grupo del array para no volver a introducirlo
						grupos.splice(num,1);
						numG = numG-1;
					
						//Asignar escenario al grupo elegido
						var s = -1;
						for(var n=0; n<numE; n++){
							var d = escenarios[n].split("|");
							if(d[2]==(j-1)){
								if(d[1]>s){
									textoEscenario = d[0];
									num = n;
									s = d[1];
								}
							}
						}
					
						//Borrar el escenario del array para no volver a introducirlo
						escenarios.splice(num,1);
						numE = numE-1;
					
						var textoCelda = document.createTextNode(textoGrupo + " (" + textoEscenario + ")");
					}
				
					// Asignar los valores a la celda
					celda.appendChild(textoCelda);
					hilera.appendChild(celda);
					
				}
	 
				// agrega la hilera al final de la tabla (al final del elemento tblbody)
				tblBody.appendChild(hilera);
			}
	 
			// posiciona el <tbody> debajo del elemento <table>
			tabla.appendChild(tblBody);
			
			// ordenar la tabla según los horarios que se introducen
			var tablaFinal = document.createElement("table");
			var tblBodyFinal = document.createElement("tbody");
			
			tablaFinal.setAttribute("border", "2");
			tablaFinal.setAttribute("style", "width:70%");
			tablaFinal.setAttribute("align", "center");

			tblBodyFinal.appendChild(tabla.rows[0]);
			var x = 1;
			for(var a=0; a<parseInt(document.getElementById('numberHorarios').value); a++){//recorrer en el orden bueno
				for(var b=0; b<parseInt(document.getElementById('numberHorarios').value)+1; b++){//recorrer en el orden introducido
					if(horariosAux[a]==horariosIntro[b]){
						tblBodyFinal.appendChild(tabla.rows[b]);
					}
				}
			}
			tablaFinal.appendChild(tblBodyFinal);
			
			propuestaElement.appendChild(tablaFinal);
		}
	},
	"click .js-new-number-calendar":function(event){
		$("#calendar_create").show('slow');
		$("#calendar_create_2").hide();
	},
	"click .js-new-festival":function(event){
		if (Meteor.user()){
			$("#repeatName").hide();
			$("#notData").hide();
			$("#wrongDates").hide();
			
			// verify that some data is introduced
			if(nombreFestival.value=="" || descripcion.value=="" || capacidad.value=="" || diaInicio.value=="" || diaFin.value=="" || lugar.value==""){
				$("#notData").show('slow');
				return false;
			}
			
			// verify that there is no festival with that name
			if(Festivals.findOne({name:document.getElementById('nombreFestival').value}) != undefined ){
				$("#repeatName").show('slow');
				return false;
			}
			
			// verify that the dates are correct, de start before end
			if(diaInicio.value > diaFin.value){
				$("#wrongDates").show('slow');
				return false;
			}
			
			Festivals.insert({
				name: document.getElementById('nombreFestival').value,
				place: document.getElementById('lugar').value,
				description: document.getElementById('descripcion').value,
				firstDay: new Date(document.getElementById('diaInicio').value),
				lastDay: new Date(document.getElementById('diaFin').value),
				photo: document.getElementById('fotofestival').value,
				sales: document.getElementById('entradasfestival').value,
				contact_number: document.getElementById('contactofestival').value,
				webpage: document.getElementById('urlfestival').value,
				creator: Meteor.user().username,
				capacity: document.getElementById('capacidad').value,
				assistants: 0,
				created_on:new Date()
			});
			
			Meteor.users.update(Meteor.user()._id, {$push: {festivals_created: document.getElementById('nombreFestival').value}});
		}
	}
});

///count the number os people will assist to a festival
Template.infoPerfil.events({
	"click .js-follow":function(event){
		var user = Meteor.users.findOne({username:document.getElementById('surname').innerHTML});
		var username = user.username;

		//verify you can't follow yourself
		if(Meteor.user().username == username){
			alert("No puedes seguirte a ti mismo");
			$("#follow").hide('slow');
			$("#notfollow").hide('slow');
			return false;
		}

		//verify the user hasn't assist yet
		var encontrado = false;
		for(var i=0; i<Meteor.user().following.length; i++){
			if(Meteor.user().following[i]==username) encontrado = true;
		}
		if(encontrado){
			alert("¡Ya sigues a esta persona!");
			$("#follow").hide('slow');
			$("#notfollow").show('slow');
			return false;
		}else{
			Meteor.users.update(Meteor.user()._id, {$push: {following: username}});
			Meteor.users.update(user._id, {$push: {followers: Meteor.user().username}});
			$("#follow").hide('slow');
			$("#notfollow").show('slow');
			return false;// prevent the button from reloading the page
		}
	},
	"click .js-notfollow":function(event){
		var user = Meteor.users.findOne({username:document.getElementById('surname').innerHTML});
		var username = user.username;
		
		//verify you can't follow yourself
		if(Meteor.user().username == username){
			alert("No puedes seguirte a ti mismo");
			$("#follow").hide('slow');
			$("#notfollow").hide('slow');
			return false;
		}
		
		//verify the user has assist yet
		var encontrado = false;
		for(var i=0; i<Meteor.user().following.length; i++){
			if(Meteor.user().following[i]==username) encontrado = true;
		}
		if(encontrado){
			Meteor.users.update(Meteor.user()._id, {$pull: {following: username}});
			Meteor.users.update(user._id, {$pull: {followers: Meteor.user().username}});
			$("#notfollow").hide('slow');
			$("#follow").show('slow');
			return false;// prevent the button from reloading the page
		}else{
			alert("¡No seguías a esta persona!");
			$("#notfollow").hide('slow');
			$("#follow").show('slow');
			return false;
		}
	}
});
