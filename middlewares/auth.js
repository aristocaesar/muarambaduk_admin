// check if the user is authenticated
const isAuthenticated = (request, response, next) => {
  if (!request.session.user) {
    return response.redirect(response.locals.base);
  }
  next();
};

// check if the user is guest
const isGuest = (request, response, next) => {
  if (request.session.user) {
    return response.redirect(response.locals.base + 'dashboard');
  }
  next();
};

const isAdmin = (request, response, next) => {
  if (request.session.user.role == 'default') {
    return response.redirect(response.locals.base + 'dashboard');
  }
  next();
};

module.exports = {
  isAuthenticated,
  isGuest,
  isAdmin,
};
