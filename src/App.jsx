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
import TeamSummaries from "./components/Views/TeamSummaries";

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

                  <Route exact path="/" component={Home} />
                  <Route exact path="projects" component={withRouter(Projects)} />
                  <Route exact path="/summaries" component={withRouter(Summaries)} />
                  <Route exact path="/reports" component={withRouter(DailyReports)} />
                  <Route exact path="/tickets" component={withRouter(TicketReports)} />
                  <Route exact path="/projectSummaries" component={withRouter(TeamSummaries)} />

                </Switch>
              </Layout>

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
