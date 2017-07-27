import React from "react"
import Card, { CardContent } from "material-ui/Card"
import { graphql } from "react-apollo"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import RegisterForm from "../components/forms/RegisterForm"

import * as userActions from "../actions/user"
import * as alertActions from "../actions/alert"

import { REGISTER } from "../mutations"

const mergedActions = Object.assign({}, userActions, alertActions)

const styles = {
  container: {
    width: "40%",
    margin: "0 auto",
  },
}

class RegisterPage extends React.Component {
  handleRegister = (values) => {
    this.props.mutate({ variables: { user: values } }).then(({ data }) => {
      this.props.actions.setUserByToken(data.auth_token)
    }).catch((error) => {
      this.props.actions.showAlert(error.message)
    })
  }
  render() {
    return (
      <div style={styles.container}>
        <Card>
          <CardContent>
            <RegisterForm onSubmit={this.handleRegister} />
          </CardContent>
        </Card>
      </div>
    )
  }
}

RegisterPage.propTypes = {
  mutate: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
}

const Connected = connect(
  (state) => state,
  (dispatch) => ({ actions: bindActionCreators(mergedActions, dispatch) }),
)(RegisterPage)

export default graphql(REGISTER)(Connected)
