const User = require('../models/userSchema');
const { hashPassword, verifyPassword } = require('../helpers/passwordHelpers');
const {
	createToken,
	verifyToken,
	decodeToken,
} = require('../helpers/tokenHelpers');

// CREATE NEW USER ✔️

async function register(req, res) {
	try {
		const { username, email, password } = req.body;
		//hash the password before creating the user.
		const hashedPassword = hashPassword(password);
		const user = new User({ username, password: hashedPassword, email });
		await user.save();
		res.status(201).json({
			status: 201,
			username: username,
			message: 'User successfully created',
		});
	} catch (err) {
		res.status(422).json({ err });
	}
}

// LOGIN USER ✔️

async function login(req, res) {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		// did user give the correct password?
		const verified = await verifyPassword(password, user.password);
		// if password was incorrect return error response.
		if (verified) {
			// if password was correct gen new token with their ID and send ready for client session storage
			const accessToken = await createToken(user._id);
			res.status(200).json({
				success: true,
				message: 'logged in successfully.',
				accessToken,
			});
		}
	} catch (err) {
		res
			.status(401)
			.json({ succes: false, message: 'username or password incorrect' });
	}
}

// GET ALL USERS ✔️
async function findAllUsers(req, res) {
	try {
		const users = await User.find();
		res.status(200).json({
			success: true,
			data: users,
			message: 'Users successfully retrieved',
		});
	} catch (err) {
		res.status(500).json({ err });
	}
}

// FIND USER BY ID ✔️

async function findUserById(req, res) {
	try {
		const user = await User.findById(res.locals.currentUser.id);
		user.password = '';
		res.status(200).json({
			success: true,
			message: 'User successfully retrieved',
			data: {
				user,
			},
		});
	} catch (err) {
		res.status(404).json({ err });
	}
}

// FIND USER HABITS ✔️

async function findUserHabits(req, res) {
	try {
		const user = await User.findById(res.locals.currentUser.id, { 'username': 1, 'habits.habitType': 1, 'habits.completed': 1, 'habits.frequencyPerDay': 1, 'habits.bestStreak': 1, 'habits.currentStreak': 1, 'habits.days.inputCounter': 1,'habits.days.fulfilled': 1,'habits.days.date': 1,  _id: 0 });
		res.status(200).json({
			status: 200,
			data: user,
			message: 'User successfully retrieved',
		});
	} catch (err) {
		res.status(404).json({ err });
	}
}

// DELETE USER  BY ID ✔️

async function deleteUserById(req, res) {
	try {
		const user = res.locals.currentUser;
		const id = req.params.id;

		// check if id matches authenticated users id
		if (user._id !== id)
			return res.status({ success: false, message: 'not allowed.' });
		await User.findByIdAndDelete(user._id);
		res.status(204).json({
			status: 204,
			message: `${user.username} successfully deleted`,
		});
	} catch (err) {
		res.status(404).json({ err });
	}
}

module.exports = {
	login,
	register,
	findAllUsers,
	findUserById,
	findUserHabits,
	deleteUserById,
};
