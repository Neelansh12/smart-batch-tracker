const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRepository = require('../repositories/userRepository');

class AuthService {
    async register(data) {
        const { email, googleId, password, full_name, organization } = data;

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userRepository.create({
            email,
            googleId,
            password: hashedPassword,
            full_name,
            organization,
        });

        return {
            id: newUser._id,
            googleId: newUser.googleId,
            email: newUser.email,
            full_name: newUser.full_name,
        };
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                full_name: user.full_name,
            },
        };
    }

    async getCurrentUser(id) {
        const user = await userRepository.findById(id);
        if (!user) throw new Error('User not found');

        // remove password
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }


    async updateProfile(id, data) {
        const user = await userRepository.findById(id);
        if (!user) throw new Error('User not found');

        user.full_name = data.full_name || user.full_name;
        user.organization = data.organization || user.organization;

        await userRepository.save(user);

        return {
            id: user._id,
            email: user.email,
            full_name: user.full_name,
            googleId: user.googleId,
            organization: user.organization,
            avatar_url: user.avatar_url
        };
    }
}

module.exports = new AuthService();
