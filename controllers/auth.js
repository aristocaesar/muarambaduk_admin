const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userSchema = require('../schemas/userSchema');
const { default: axios } = require('axios');
const User = new mongoose.model('User', userSchema);

// show register page
const register = (request, response, next) => {
  response.render('../views/auth/register', {
    title: 'Register',
    name: 'register',
    layout: '../views/auth/auth_layout.ejs',
  });
};

// sign up user
const signup = async (request, response, next) => {
  let userInfo = {
    name: request.body.name,
    email: request.body.email,
  };
  let hashedPassword = '';
  if (request.body.password !== '') {
    hashedPassword = await bcrypt.hash(request.body.password, 12);
  }
  let user = new User({ ...userInfo, password: hashedPassword });
  await user
    .save()
    .then(() => {
      request.session.user = userInfo;
      request.session.save();
      response.redirect(
        response.locals.base + 'dashboard/demo-one/' + response.getLocale()
      );
    })
    .catch((error) => {
      response.render('../views/auth/register', {
        title: 'Register',
        name: 'register',
        layout: '../views/auth/auth_layout.ejs',
        errors: error.errors,
        input: {
          name: request.body.name,
          email: request.body.email,
          password: request.body.password,
        },
      });
    });
};

// login page
const login = (request, response, next) => {
  response.render('../views/auth/login', {
    title: 'Login',
    name: 'login',
    layout: '../views/auth/auth_layout.ejs',
  });
};

// authenticate user
const authenticate = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    await axios
      .post(`${process.env.API_URL}admin/sign-in`, {
        email,
        password,
      })
      .then(async (user) => {
        const result = user.data;

        let matchPassword = await bcrypt.compare(
          password,
          result.data.password
        );
        if (result && matchPassword) {
          let userInfo = {
            id: result.data.id,
            name: result.data.fullname,
            email: result.data.email,
            role: result.data.role,
          };
          request.session.user = userInfo;
          request.session.save();
          response.redirect(response.locals.base + 'dashboard/');
        }
      });
  } catch (error) {
    request.session.errorMessage = error.response.data.errors.message;
    response.redirect(response.locals.base);
  }
};

// sign out user
const signOut = (request, response, next) => {
  request.session.destroy();
  return response.redirect(response.locals.base);
};

// password reset page
const passwordReset = (request, response, next) => {
  response.render('../views/auth/password_reset', {
    title: 'Password Reset',
    name: 'password_reset',
    layout: '../views/auth/auth_layout.ejs',
  });
};

module.exports = {
  register,
  signup,
  login,
  passwordReset,
  authenticate,
  signOut,
};
