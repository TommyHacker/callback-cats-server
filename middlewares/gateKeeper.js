const User = require('../models/userSchema');
const { verifyToken, decodeToken } = require('../helpers/tokenHelpers');
const express = require('express');

exports.isAuthenticated = async (req, res, next) => {
	try {
		//   get access token from request headers
		const { accessToken } = req.body;
		// make sure its a valid token
		const verified = verifyToken(accessToken);
		// if not valid, return not allowed
		if (!verified)
			return res.status(500).json({ success: false, message: 'not allowed.' });
		// if valid, get the (id) back out of the token
		const id = await decodeToken(accessToken);
		// get all the user information from the id
		const user = await User.findById(id);
		// set the global currentUser to this user
		res.locals.currentUser = user;
		// call next() which will now carry on to the endpoint the user requested,
		// but now the endpoint has the ability to use res.locals.currentUser.id or .username etc.
		next();
		//   auth should now have been taken care of and will not need to be done in the controllers.
	} catch (err) {
		res.status(500).json({ success: false, message: 'not allowed.' });
	}
};
