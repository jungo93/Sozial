// start up function that creates entries in the Websites databases.
 Meteor.startup(function () {
	// code to run on server at startup
    if (!Festivals.findOne()){
		
		///CREATE FESTIVALS
    	Festivals.insert({
			name: "Viña Rock 2016", 
    		place: "Villarobledo, Albacete", 
    		description: "Viña rock!!!!!!!!!!!",
    		firstDay: new Date(2016,04,28),
    		lastDay: new Date(2016,04,30),
    		photo: "http://www.dodmagazine.es/wp-content/uploads/2015/01/cartel-vina-rock-2016.jpg",
    		sales: "http://www.vina-rock.com/entradas/",
    		contact_number: 949112233,
    		webpage: "http://www.vina-rock.com/",
    		creator: "Javi33",
    		capacity: 70000,
    		assistants: 0,
    		created_on:new Date()
    	});
    	Festivals.insert({
    		name: "Azkena Rock", 
    		place: "Vitoria-Gasteiz, Álava", 
    		description: "El mejor rock de todos los tiempos.",
    		firstDay: new Date(2016,06,12),
    		lastDay: new Date(2016,06,15),
    		photo: "https://bilbaoenvivo.files.wordpress.com/2012/06/bev-cartel-azkena1.jpg",
    		sales: "http://azkenarockfestival.com/es-es/entradas/bonos",
    		contact_number: 945678967,
    		webpage: "http://azkenarockfestival.com/",
    		capacity: 5000,
    		assistants: 0,
    		creator: "12Maria12",
    		created_on:new Date()
    	});
    	Festivals.insert({
    		name: "Heineken Jazzaldia", 
    		place: "Donostia-San Sebastián, Guipúzcoa", 
    		description: "Jazz por los cuatro costados, en un lugar ideal.",
    		firstDay: new Date(2016,07,25),
    		lastDay: new Date(2016,07,27),
    		photo: "https://3.bp.blogspot.com/-haeUUOeDVak/Vsdz8T3ay_I/AAAAAAAAu0A/G0MTZ_zUbuU/s1600/jazzaldia.jpg",
    		sales: "http://heinekenjazzaldia.com/es/entradas/",
    		contact_number: 945678967,
    		webpage: "http://heinekenjazzaldia.com/es/",
    		creator: "Donostia2016",
    		capacity: 20000,
    		assistants: 0,
    		created_on:new Date()
    	});
    	Festivals.insert({
    		name: "Bilbao BBK Live", 
    		place: "Bilbao, Vizcaya", 
    		description: "Un año más, los grupos más influyentes se dan cita en el botxo.",
    		firstDay: new Date(2016,07,17),
    		lastDay: new Date(2016,07,19),
    		photo: "http://www.orbitamagazine.com/wp-content/uploads/2015/11/12801367_10154059855177932_5713679489657265029_n.jpg",
    		sales: "http://bilbaobbklive.com/es-es/entradas",
    		contact_number: 945678967,
    		webpage: "http://bilbaobbklive.com/en-us/home",
    		creator: "athleticBilbao",
    		capacity: 40000,
    		assistants: 0,
    		created_on:new Date()
    	});
  
	}
	
	process.env.MAIL_URL = "smtp://postmaster@sandbox95b74b9ea4004ff78ac9807a9619a6f3.mailgun.org:dc92304f3baf8f4ad48a0bf336070f64@smtp.mailgun.org:587";
});

// add new attributes to users
Accounts.onCreateUser(function(options, user) {
	user.name = '';
    user.surname = '';
    user.birthday = '';
    user.gender = '';
    user.place = '';
    user.music_style = '';
    user.image = '';
    user.festivals_assisted = [];
    user.festivals_created = [];
    user.followers = [];
    user.following = [];
	if (options.profile)
		user.profile = options.profile;
	return user;
});

Meteor.publish('userData', function() {
  if(!this.userId) return null;
  return Meteor.users.find();
});
