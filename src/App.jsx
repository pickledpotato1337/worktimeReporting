import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter, Redirect, Route, Switch, withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Layout from './components/Layout/Layout';
import Summaries  from './components/Views/Summaries';
import Projects  from './components/Views/Projects';
import TicketReports  from './components/Views/TicketReports';
import Home  from './components/Views/Home';
import Login from './components/Views/Login';
import { authCheckState } from './store/actions/index';
import DailyReports from "./components/Views/DailyReports";

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoLogin();
  }

  render() {
    return (
        <>
          <Switch>
            <BrowserRouter>
              <Route path="/login" component={Login} />
              <Layout>
                <Switch>

                  <Route path="/" component={Home} />
                  <Route path="projects" component={Projects} />
                  <Route path="/summaries" component={Summaries} />
                  <Route path="/reports" component={DailyReports} />
                  <Route path="/tickets" component={TicketReports} />

                </Switch>
              </Layout>
              <Redirect to="/" />
            </BrowserRouter>
          </Switch>
        </>
    );
  }
}

App.propTypes = {
  onTryAutoLogin: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.token !== null,
});

const mapDispatchToProps = (dispatch) => ({
  onTryAutoLogin: () => dispatch(authCheckState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
