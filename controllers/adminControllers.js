const User = require('../models/userSchema');
const mongoose = require('mongoose');
const express = require('express');
const { hashPassword } = require('../helpers/passwordHelpers');

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res
			.status(200)
			.json({ success: true, message: 'got all users', data: users });
	} catch (err) {
		res.status(500).json({ success: false, message: 'something went wrong.' });
	}
};
exports.createNewUser = async (req, res) => {
	try {
		const { username, password, email } = req.body;
		const hashedPassword = hashPassword(password);
		const user = new User({ username, email, password: hashedPassword });
		await user.save();
		res
			.status(200)
			.json({ success: true, message: 'user created', data: user });
	} catch (err) {
		res.status(500).json({ success: false, message: 'something went wrong.' });
	}
};
exports.getOneUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		res.status(200).json({ success: true, message: 'found user.', data: user });
	} catch (err) {
		res.status(500).json({ success: false, message: 'something went wrong.' });
	}
};

// exports.updateOneUser = async (req, res) => {};
exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: 'user deleted' });
	} catch (err) {
		res.status(500).json(err.message);
	}
};
