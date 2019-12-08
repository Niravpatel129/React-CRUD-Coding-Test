import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-awesome-modal';
import axios from 'axios';

import checkDifference from './helpers/checkDifference';

import './UpdateEmployeeModal.css';

class UpdateEmployeeModal extends Component {
  state = {
    visible: this.props.visible,
    _id: this.props.data._id,
    id: this.props.data.id,
    name: this.props.data.name,
    code: this.props.data.code,
    profession: this.props.data.profession,
    city: this.props.data.city,
    branch: this.props.data.branch,
    color: this.props.data.color,
  };

  closeModal() {
    this.props.toggleUpdateModal();
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();

    if (checkDifference(this.state, this.props.data)) {
      this.closeModal();
      return;
    }

    const res = await axios.put(this.props.apiURL('/api/updateEmployee'), {
      _id: this.state._id, // hidden primary key
      id: this.state.id,
      name: this.state.name,
      code: this.state.code,
      profession: this.state.profession,
      city: this.state.city,
      branch: this.state.branch,
      color: this.state.color,
      assigned: true,
    });

    setTimeout(() => {
      if (res.status === 200) {
        this.props.globalAlerts('Updated!');
        this.props.getEmployees();
        this.closeModal();
      } else {
        this.props.globalAlerts('You cannot use the same id!!', 'error');
        this.closeModal();
      }
    }, 100);
  };

  renderInputs = () => {
    const keys = [
      'id',
      'name',
      'code',
      'profession',
      'city',
      'branch',
      'color',
    ];

    return keys.map(key => (
      <div className="employeesInput" key={key}>
        <input
          type={key === 'id' ? 'number' : 'text'}
          placeholder={key}
          name={key}
          value={this.state[key]}
          onChange={this.handleInputChange}
          required
        />
      </div>
    ));
  };

  render() {
    return (
      <section>
        <Modal visible={true} onClickAway={() => this.closeModal()}>
          <div>
            <form id="msform" onSubmit={this.handleSubmit}>
              <fieldset>{this.renderInputs()}</fieldset>
              <input
                type="submit"
                name="next"
                className="next action-button"
                value="Update"
                required
              />{' '}
            </form>
          </div>
        </Modal>
      </section>
    );
  }
}

UpdateEmployeeModal.propTypes = {
  apiURL: PropTypes.func,
  data: PropTypes.object,
  getEmployees: PropTypes.func,
  globalAlerts: PropTypes.func,
  toggleUpdateModal: PropTypes.func,
  visible: PropTypes.bool,
};

export default UpdateEmployeeModal;
