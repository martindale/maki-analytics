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
    }
  }
  
}

Analytics.prototype.middleware = function(req, res, next) {
  var self = this;
  res.format({
    html: function() {
      console.log('logging!');
      
      // TODO: set session user as second param
      var visitor = ua( self._id );
      visitor.pageview({
        dp: req.path,
        dt: (res.page) ? res.page.title : undefined,
        uip: req.ip,
        ua: req.headers['user-agent'] 
      }).send(function(err , data) {
        console.log('analytics response:', err , data );
      });
      console.log('moving on');
      next();
    },
    json: function() {
      console.log('probably robot.  not logging.');
      next();
    }
  });
}

module.exports = Analytics;
