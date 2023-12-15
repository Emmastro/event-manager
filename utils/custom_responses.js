const render404 = (res, message) => { 
return res.status(404).render("404.ejs", { message});
};

const render403 = (res, message) => { 
    return res.status(403).render("403.ejs", { message});
    };

module.exports = { render404, render403 };