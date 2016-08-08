// external package imports
import React from 'react';
import $ from 'jquery';

// view imports
import Query from './Query.js';
import Result from './Result.js';

/*
 * Dashboard
 *
 * Container Component that acts as a controller for Query and Result, making
 * the call to the express route on the server-side.
 */
class Dashboard extends React.Component {
	// set up initial states
	constructor(props) {
		super(props);
		this.state = {apiData: {carrier:'', flight:'', dep:'', arr:'', delay:0, status:0},
									loader: false,
									result: false};
		this.handleSearch = this.handleSearch.bind(this);
		this.loaderVis = this.loaderVis.bind(this);
	}

	//           handleSearch(string carrier, string flight)
	// takes in a carrier and flight and calls the express route on the server-side.
	// this method is passed to Query through its props
	handleSearch(carrier, flight) {
		this.setState({loader: true, result: false});		// toggle visibility for the loader and results
		$.ajax({
			url: `/flightStats/${carrier}/${flight}`,			// route defined in root/index.js
			type: 'GET',
			dataType: 'json',
			cache: false,
			success: (data) => {
				// success: pass data to Result
				this.setState({apiData: { carrier: carrier, flight: flight,
																	dep: data.dep,
																	arr: data.arr,
																	delay: data.delay,
																	status: 200 },
											loader: false, result: true});
			}.bind(this),
			error: (xhr, stat, err) => {
				// error: pass on the status to Result
				this.setState({apiData: {carrier:'', flight:'', dep:'', arr:'', delay:0, status: stat},
											loader: false, result: true});
			}.bind(this)
		});
	}

	// helper to toggle the loader className between visible and hidden based on state.loader
	loaderVis(bool) {
		return bool ? 'visible loader' : 'hidden loader';
	}

	// toggle vis/hidden based on state.result. bound to props
	resultVis(bool) {
		return bool ? 'visible' : 'hidden';
	}

	render () {
		// Query: pass handleSearch function so api call can be made on submit
		// loader/result: toggle visability
		// Result: pass along either data or an error code
		return (
      <div className='dash-div'>
				<img id='logo' src='../images/logo.png'/>
				<Query onSubmit={this.handleSearch}/>
				<img className={this.loaderVis(this.state.loader)} src='../images/ripple.svg'/>
				<div className={this.resultVis(this.state.result)}>
					<Result data={this.state.apiData}/>
				</div>
      </div>
    );
	}
}

export default Dashboard;
