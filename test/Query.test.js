let React = require('react');
let TestUtils = require('react/lib/ReactTestUtils');
let Query = require('../src/views/Query.js');

// Tests of the Query View
describe('Query', () => {
  let element;

  beforeAll( () => {
    element = TestUtils.renderIntoDocument(<Query/>);
  });

  it('should render', () => {
    expect(element).not.toBe(null);
  });

  it('should render all its children', () => {
    let f = (component) => {
      if(TestUtils.isDOMComponent(component) || TestUtils.isCompositeComponent(component)){
        return true;
      }
    };
    let list = TestUtils.findAllInRenderedTree(element, f);
    expect(list.length).toEqual(4);
  });

  it('check UI state before input', () => {
    let field = TestUtils.findRenderedDOMComponentWithClass(element, 'invalid form-control');
    expect(field.placeholder).toEqual('enter a flight number...');
    expect(field.value).toEqual('');
    let btn = TestUtils.findRenderedDOMComponentWithClass(element, 'btn');
    expect(btn.value).toEqual('Skurt Flight Search');
    expect(btn.disabled).toEqual(true);
  });

  it('check UI at different text entry states', () => {
    // Simulate typing 'AA' [invalid]
    let field = TestUtils.findRenderedDOMComponentWithClass(element, 'invalid form-control');
    TestUtils.Simulate.change(field, {target: {value: 'AA'}});

    // check ui
    expect(field.value).toEqual('AA');
    let btn = TestUtils.findRenderedDOMComponentWithClass(element, 'btn');
    expect(btn.disabled).toEqual(true);

    // Simulate typing 'AAL100' [valid]
    TestUtils.Simulate.change(field, {target: {value: 'AAL100'}});

    // check ui
    expect(field.value).toEqual('AAL100');
    expect(btn.disabled).toEqual(false);
  });

  it('check handleSubmit splits carrier and flight properly', () => {
      let carrierTest = '';
      let flightTest = '';
      let handleSubmit = (carrier, flight) => {
          carrierTest = carrier;
          flightTest = flight;
      };
      let queryElem = TestUtils.renderIntoDocument(<Query onSubmit={handleSubmit}/>);

      // test no spaces
      let field = TestUtils.findRenderedDOMComponentWithClass(queryElem, 'invalid form-control');
      TestUtils.Simulate.change(field, {target: {value: 'AAL100'}});
      let btn = TestUtils.findRenderedDOMComponentWithClass(queryElem, 'btn');
      TestUtils.Simulate.click(btn);
      expect(carrierTest).toEqual('AAL');
      expect(flightTest).toEqual('100');

  });
});
