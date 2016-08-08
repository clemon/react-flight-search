// external package imports
import React from 'react';
import $ from 'jquery';
import { Input, Button } from 'react-bootstrap';

// regex to rule out some invalid flight numbers
const rePattern = /(.{2}[A-za-z]?)( )*([0-9]+)/g;

/*
 * Query
 *
 * Contains the form (search bar and button). Passed handleSearch from Dashboard
 * in order to start the api call on form submit.
 */
class Query extends React.Component {

  // init state, bind methods to this
  constructor(props) {
    super(props);
    this.state = {flightNum: '', btnState: 'false'};  // flightNum: keeps track of whats input
                                                      // btnState: toggle state to disable the button
                                                      //           when regex doesnt match flightNum
    this.handleFlightNumChange = this.handleFlightNumChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.btnState = this.btnState.bind(this);
    this.fieldState = this.fieldState.bind(this);
    this.checkFlightNum = this.checkFlightNum.bind(this);

    // bind the enter key to submit forms
    $('input').keypress((e) => {
      if (e.which == 13) {
        e.preventDefault();
        $('form').submit();
      }
    });

  }

  //      handleFlightNumChange(event e)
  // called everytime there is a change in the search bar. updates flightNum state
  handleFlightNumChange(e) {
    this.setState({ flightNum: e.target.value });
  }

  //      checkFlightNum(string num)
  // checks the passed in string for match to regex. returns null if not found
  // helper method used throughout
  checkFlightNum(num) {
    let match = rePattern.exec(num);
    rePattern.lastIndex = 0;          // reset regex
    return match;
  }

  //      btnState(string num)
  // adds disabled class to the button if the current flightNum state is not valid
  // bound to submit button
  btnState(num) {
    return this.checkFlightNum(num)!==null ? '' : 'disabled';
  }

  //      fieldState(string num)
  // toggles className depending on if current flightNum is valid
  // bound to search bar
  fieldState(num) {
    return this.checkFlightNum(num)!==null ? 'form-control' : 'invalid form-control';
  }

  //      handleSubmit
  // uses regex to separate carrier from flight and calls method passed in by Dashboard
  handleSubmit(e) {
    e.preventDefault();     // make sure there is no page navigation
    let match = this.checkFlightNum(this.state.flightNum.trim());
                                                  // check regex

    if (!match) { return; }                       // if no match, quit

    let carrier = match[1].toUpperCase(),         // separate carrier/flight
        flight = match[3];                        // for api use
    this.props.onSubmit(carrier, flight);         // call Dashboard.handleSearch
  }

  render() {
    return(
      <form className='query-form' onSubmit={this.handleSubmit}>
        <input
          className={this.fieldState(this.state.flightNum)}
          placeholder='enter a flight number...'
          value={this.state.flightNum}
          onChange={this.handleFlightNumChange}/>
        <input className='btn' type='submit'
          value='Skurt Flight Search'
          disabled={this.btnState(this.state.flightNum)}/>
      </form>
    );
  }

}

export default Query;
