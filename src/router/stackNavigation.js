import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BackHandler} from 'react-native';
import {Stack} from './navigationConfiguration';
import PropTypes from 'prop-types';
import {NavigationActions} from 'react-navigation';
import {createReactNavigationReduxMiddleware, reduxifyNavigator} from 'react-navigation-redux-helpers';
import {applyMiddleware, bindActionCreators, combineReducers, createStore} from 'redux';
import * as types from '../actions/actionTypes';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';

const navigationMiddleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.navigationReducer,
);

const App = reduxifyNavigator(Stack, 'root');

const mapStateToProps = state => {
    const navigation = state.navigationReducer;
    return {
        navigation,
        state: {
            ...state.navigationReducer
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(types, dispatch),
        dispatch
    };
};

const AppWithNavigationState = connect(
    mapStateToProps
)(App);

const reducer = combineReducers(rootReducer);

const configureStore = () => {
    const store = createStore(
        reducer,
        applyMiddleware(navigationMiddleware, thunk)
    );

    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = combineReducers(require('../reducers/index').default);
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};

class StackNavigation extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        navigation: PropTypes.shape().isRequired,
        actions: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        const {dispatch, nav} = this.props;
        if (nav.index === 0) {
            return false;
        }

        dispatch(NavigationActions.back());
        return true;
    };

    render() {
        return (
            <AppWithNavigationState/>
        );
    }
}


const AppNavigator = connect(
    mapStateToProps,
    mapDispatchToProps
)(StackNavigation);

export {
    configureStore,
    AppNavigator
};