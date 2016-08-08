let React = require('react');
let TestUtils = require('react/lib/ReactTestUtils');
let Dashboard = require('../src/views/Dashboard.js');

// Tests of the Dashboard View
describe('Dashboard', () => {
  let element;

  beforeAll( () => {
    element = TestUtils.renderIntoDocument(<Dashboard/>);
  });

  it('should render', () => {
    expect(element).not.toBe(null);
  });

  it('should render all its children', () => {
    let div = TestUtils.findRenderedDOMComponentWithClass(element, 'dash-div');
    expect(div.className).toEqual('dash-div');
    let f = (component) => {
      if(TestUtils.isDOMComponent(component) || TestUtils.isCompositeComponent(component)){
        return true;
      }
    };
    let list = TestUtils.findAllInRenderedTree(element, f);
    expect(list.length).toEqual(14);
  });

});
