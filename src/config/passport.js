var LocalStrategy = require("passport-local").Strategy;
var cookieSession = require('cookie-session');

var testUser = {
	id: 1,
	firstName: "Rodrigo",
	lastName: "Pavez",
	username: "rpavez"
};

export default (app,express) => {


	// Local Strategy
	app.passport.use('local', new LocalStrategy(
		function(email, password, done) {
		    app.models.User.find({ where: { email : email } }).then(function (user) {
		      if (!user) {
		        return done(null, false, { message: 'Incorrect email address.' });
		      }
		      if (!user.validPassword(password)) {
		        return done(null, false, { message: 'Incorrect password.' });
		      }
		      return done(null, user);
		    });
		}
	));

	// LDAP Strategy
	app.passport.use('ldap', new LocalStrategy(
		function(username, password, done) {
			console.log("USING LDAP STRATEGY");

			ldap.ldapUserLogin({
				username: username,
				password: password
			}, function(err, ldapUser) {
				if (err) {
					// if (err.code && err.code === 49) {
					// 	reportError('ldap', username, "LDAP_INVALID");
					// } else {
					// 	reportError('ldap', username, "LDAP_ERROR");
					// }
					return done(null, null, {
						message: "Active directory error: " + err
					});
				} else if (!ldapUser) {
					//reportError('ldap', username, "LDAP_INVALID");
					return done(null, null, {
						message: "Wrong username or password. (In Active Directory)"
					});
				}

				console.log("Looking for LDAP user: " + ldapUser.sAMAccountName);
				//ldapUser.sAMAccountName.toUpperCase()
				done(null, testUser)
			});
		}
	));

		app.passport.serializeUser(function(user, done) {
		  done(null, user.id);
		});

		app.passport.deserializeUser(function(id, done) {
		  app.models.User.findOne(id).success(function(user) { done(null, user); });
		});


	function activeDirectoryAuth(req, res, next, callback) {
		console.log("LDAP")
		app.passport.authenticate('ldap', function(err, user, info) {
			req.logIn(user, function(err) {
				if (err) {
					return res.json(500, {
						success: false,
						user: null,
						msg: err.message
					});
				} else {
					return res.json(200, {
						user: user,
						msg: "Welcome, " + user.username + "!"
					});
				}
			});
		})(req, res, next);
	}


	function localAuth(req, res, next) {
		console.log("LOCAL")
		app.passport.authenticate('local', function(err, user, info) {
			console.log("Getting here")
			console.log("user",user)
			console.log("err",err)
			console.log("info",info)
			// Search by user id
			req.logIn(user, function(err) {

				console.log(JSON.stringify(user))
				if (err) {
					return res.json(500, {
						success: false,
						user: null,
						msg: err.message
					});
				} else {
					return res.json(200, {
						user: user,
						msg: "Welcome, " + user.username + "!"
					});
				}
			});
		})(req, res, next);
	}

	app.post('/login', function(req, res, next) {
		console.log("Login LOCAL")
		// if (req.body.conntype === "ActiveDirectory") {
		// 	return activeDirectoryAuth(req, res, next);
		// }
		return localAuth(req, res, next);

	});

	app.all("/logout", function(req, res) {
		req.logout();
		res.send();
	});

};