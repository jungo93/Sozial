Festivals = new Mongo.Collection("festivals");

// set up security on festivals collection
Festivals.allow({

	// to be able to update festivals for ratings.
	update:function(userId, doc){
		console.log("testing security on festival update");
		if (Meteor.user()){// they are logged in
			return true;
		} else {// user not logged in - do not let them update (rate) the festival.
			return false;
		}
	},

	insert:function(userId, doc){
		console.log("testing security on festival insert");
		if (Meteor.user()){// they are logged in
			return true;
		}
		else {// user not logged in
			return false;
		}
	},
	
	remove:function(userId, doc){
		console.log("testing security on festival insert");
		if (Meteor.user()){// they are logged in
			return true;
		}
		else {// user not logged in
			return false;
		}
	}
})

// set up security on users collection
Meteor.users.allow({
    update: function(userId, docs, fields, modifier) {
        return true;
    }
});
