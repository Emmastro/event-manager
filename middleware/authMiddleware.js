const {render403} = require("../utils/custom_responses");

function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        // Store the original URL only if it's not the login page
        if (req.path !== '/authenticate/login') {
            req.session.originalUrl = req.originalUrl;
        }
        return res.redirect("/authenticate/login");
    }
    next();
}
  
  function isAdmin(req, res, next) {
    if (req.session.isAuthenticated && req.session.user.role === "admin") {
      return next();
    }

    console.log("403 page: ", res.session?.user);
    return render403(res, "You are not authorized to access this page.");
  }
  
  // middleware to add isAuthenticated and isAdmin to all responses
function addAuthVariablesToEJS(req, res, next) {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.isAdmin = req.session.isAuthenticated && req.session.user.role === 'admin';
    next();
}


  module.exports = { isAuthenticated, isAdmin, addAuthVariablesToEJS };
  