let React = require('react');
let TestUtils = require('react/lib/ReactTestUtils');
let Result = require('../src/views/Result.js');

// Tests of the Result View
describe('Result', () => {
  let element;

  beforeAll( () => {
    let data = {carrier:'', flight:'', dep:'', arr:'', delay:0, status:0};
    element = TestUtils.renderIntoDocument(<Result data={data}/>);
  });

  it('should render', () => {
    expect(element).not.toBe(null);
  });

  it('should render all its children', () => {
    let div = TestUtils.findRenderedDOMComponentWithClass(element, 'result-div');
    expect(div.className).toEqual('result-div');
    let f = (component) => {
      if(TestUtils.isDOMComponent(component) || TestUtils.isCompositeComponent(component)){
        return true;
      }
    };
    let list = TestUtils.findAllInRenderedTree(element, f);
    expect(list.length).toEqual(5);
  });

  it('check UI with fake data', () => {
    // populate the component with fake success data
    let data = {carrier:'AAL', flight:'100', dep:'LAX', arr:'SAN', delay:15, status:200};
    element = TestUtils.renderIntoDocument(<Result data={data}/>);

    // check ui
    let h1 = TestUtils.findRenderedDOMComponentWithTag(element, 'h1');
    let h2 = TestUtils.findRenderedDOMComponentWithTag(element, 'h2');
    expect(h1.textContent.substring(0,7)).toEqual('AAL 100');
    expect(h2.textContent).toEqual('Delayed: 15 minutes');
  });

  it('check UI with fake data', () => {
    // populate the component with fake error data
    let data = {carrier:'G6', flight:'6969', dep:'', arr:'', delay:0, status:404};
    element = TestUtils.renderIntoDocument(<Result data={data}/>);

    // check ui
    let h1 = TestUtils.findRenderedDOMComponentWithTag(element, 'h1');
    let h2 = TestUtils.findRenderedDOMComponentWithTag(element, 'h2');
    expect(h1.textContent).toEqual('Error');
    expect(h2.textContent).toEqual('Flight not found');

  });

});
