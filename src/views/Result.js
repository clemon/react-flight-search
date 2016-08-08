// external package imports
import React from 'react';
import { Glyphicon } from 'react-bootstrap';

/*
 * Result
 *
 * Receives and displays data or errors from Dashboard api call
 */
class Result extends React.Component {

  constructor(props) {
    super(props);
    this.displayTitle = this.displayTitle.bind(this);
    this.displayDetail = this.displayDetail.bind(this);
  }

  // render flight number and airport codes if successful api response
  displayTitle(data) {
    if (data.status == 200){
      return(
        <h1>
          {data.carrier} {data.flight}&emsp;&emsp;&emsp;
          {data.dep} <Glyphicon glyph='arrow-right'/> {data.arr}
        </h1>
      );
    }
    else {
      return(
        <h1>Error</h1>
      );
    }
  }

  // provide details about the delay if success or which error if not
  displayDetail(data) {

    let detail = '';
    if (data.status == 200 && data.delay == 0) {
      detail = 'On time';
    }
    else if(data.status == 200 && data.delay > 0) {
      detail = `Delayed: ${data.delay} minutes`;
    }
    else if(data.status == 404 || data.status == 'error') {
      detail = 'Flight not found';
    }
    else if(data.status == 400) {
      detail = 'invalid flight number';
    }
    else {
      detail = 'Something went wrong';
    }

    return detail;
  }

  render () {
    return(
      <div className='result-div'>
        {this.displayTitle(this.props.data)}
        <hr></hr>
        <h2>{this.displayDetail(this.props.data)}</h2>
      </div>
    );
  }

}

export default Result;
