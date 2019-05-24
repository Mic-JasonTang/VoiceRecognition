exports = module.exports = function (req, res) {
    var locals = res.locals;

    res.render('views/index', {
        section: 'index'
    });

}