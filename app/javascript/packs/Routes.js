import React from "react"
import { Route, Switch } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"

import Header from "./components/Header"
import Alert from "./components/Alert"

import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import PhotoPage from "./pages/PhotoPage"

import * as userActions from "./actions/user"

const styles = {
  container: {
    paddingTop: "90px",
  },
}

class Routes extends React.Component {
  componentWillMount() {
    this.props.actions.setUserByToken()
  }
  render() {
    const { history, ConnectedRouter } = this.props

    return (
      <ConnectedRouter history={history}>
        <div>
          <Header />

          <div style={styles.container}>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/register" component={RegisterPage} />
              <Route exact path="/login" component={LoginPage} />
              <Route path="/users/:username" component={ProfilePage} />
              <Route path="/photos/:id" component={PhotoPage} />
            </Switch>
          </div>

          <Alert />
        </div>
      </ConnectedRouter>
    )
  }
}

Routes.propTypes = {
  history: PropTypes.object.isRequired,
  ConnectedRouter: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
}

export default connect(
  (state) => state,
  (dispatch) => ({ actions: bindActionCreators(userActions, dispatch) }),
)(Routes)
