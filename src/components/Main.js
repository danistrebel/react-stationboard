require('normalize.css');
require('styles/App.css');

import React from 'react';

var App = React.createClass({
  render() {
    return (
      <div className="index">
        <Station name={'Zoo Zuerich'} />
      </div>
    );
  }
});

export default App

var Station = React.createClass({
  render() {
    return (
      <div>
        <h3>Station: {this.props.name}</h3>
        <DepartureList name={this.props.name} />
      </div>
    );
  }
});

var DepartureList = React.createClass({

  pollInterval: 60*1000,

  loadDepartures: function() {
    var component = this;
    var request = require('superagent');
    request
      .get('http://transport.opendata.ch/v1/stationboard?station=' + this.props.name + '&limit=15')
      .end(function(err, res){
          if(res.ok) {
            component.setState({departures: res.body.stationboard});
          }
      });
  },

  getInitialState: function() {
    return {departures: []};
  },

  componentDidMount: function() {
    this.loadDepartures();
    setInterval(this.loadDepartures, this.pollInterval);
  },

  render() {

    var timeNow = (new Date()).getTime() / 1000;
    var departuresNodes = this.state.departures.map(function(departure) {

      var diff = (departure.stop.departureTimestamp - timeNow)

      return (
        <section>
          <h4>{departure.name} to {departure.to} in {Math.floor(diff / 60)}&#39;</h4>
        </section>
      );
    });

    return (
      <section>
          <p>Next Departures:</p>
          {departuresNodes}
      </section>
    );
  }
});
