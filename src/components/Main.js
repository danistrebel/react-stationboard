require('normalize.css');
require('styles/App.css');

import React from 'react';

var App = React.createClass({

  handleStationChange: function(event) {
    if(event.keyCode == 13){
        this.setState({stationName: event.target.value});
    }
  },
  getInitialState: function() {
    return {
      stationName: 'Zoo Zurich'
    };
  },
  render() {
    return (
      <div className="index">
        <h1>React Station Board</h1>
        <input name="station-name" type="text" onKeyUp={this.handleStationChange}/>
        <Station name={this.state.stationName} />
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

  pollInterval: 5*1000,

  loadDepartures: function(stationName) {
    var request = require('superagent');
    request
      .get('http://transport.opendata.ch/v1/stationboard?station=' + (stationName || this.props.name) + '&limit=15')
      .end(function(err, res){
        if(res.ok && this.isMounted()) {
          this.setState({departures: res.body.stationboard});
        }
      }.bind(this));
  },

  getInitialState: function() {
    return {departures: []};
  },

  componentDidMount: function() {
    this.loadDepartures();
    setInterval(this.loadDepartures, this.pollInterval);
  },

  componentWillReceiveProps: function(nextProps){
    this.loadDepartures(nextProps.name);
  },

  render() {

    var timeNow = (new Date()).getTime() / 1000;
    var departuresNodes = this.state.departures.map(function(departure, i) {

      var diff = (departure.stop.departureTimestamp - timeNow)

      return (
        <section key={i}>
          <h4>{departure.name} to {departure.to} in {Math.floor(diff / 60)}&#39;</h4>
        </section>
      );
    });

    return (
      <section>
          <p>Next Departures:</p>
          {this.props.name}
          {departuresNodes}
      </section>
    );
  }
});
