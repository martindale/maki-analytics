var ua = require('universal-analytics');

function Analytics( config ) {
  var self = this;
  self._id = config.id;
  
  self.extends = {
    services: {
      http: {
        pre: {
          query: self.middleware,
          get: self.middleware
        }
      }
    },
    resources: {
      '*': {
        pre: {
          create: function(done) {
            // TODO: event tracking
          }
        }
      }
    }
  }
  
}

Analytics.prototype.middleware = function(req, res, next) {
  var self = this;
  res.format({
    html: function() {
      console.log('logging!');
      
      // TODO: set session user as second param
      var visitor = ua( self._id , (req.session) ? req.session.cid : undefined );

      visitor.pageview({
        dp: req.path,
        dr: req.header('referrer'),
        dt: (res.page) ? res.page.title : undefined,
        uip: req.ip,
        ua: req.headers['user-agent'] 
      }).send(function(err , data) {
        console.log('analytics response:', err , data );
      });

      req.visitor = visitor;
      req.session.cid = visitor.cid;
      req.session.save(function(err) {
        next();
      });
    },
    json: function() {
      console.log('probably robot.  not logging.');
      next();
    }
  });
}

module.exports = Analytics;
