import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState as app } from '../reducer';
import AppContainer from '../index';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('<AppContainer />', () => {
  it('should render with default props', () => {
    const store = mockStore({ app });
    const wrapper = shallow(
      <AppContainer location={{ pathname: '/' }} store={store}>
        <div />
      </AppContainer>,
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot(); // eslint-disable-line
  });
});
