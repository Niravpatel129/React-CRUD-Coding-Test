import React from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import ReactTable from 'react-table';

import { connect } from 'react-redux';
import { setLoadingSpinner } from '../../actions';

import AddEmployeeButton from '../AddEmployeeButton/AddEmployeeButton';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import UpdateEmployeeModal from '../UpdateEmployeeModal/UpdateEmployeeModal';

import './EmployeesTable.css';
import 'react-table/react-table.css';

import { colorCheckerHelper } from './helpers/colorCheckerHelper';

const zippi = new Audio('https://limonte.github.io/mp3/zippi.mp3');
const poof = new Audio(
  'https://raw.githubusercontent.com/Niravpatel129/World-Shooter-game-browser-multiplayer-online-/master/public/assets/poof.mp3'
);
const zip = new Audio(
  'https://raw.githubusercontent.com/Niravpatel129/World-Shooter-game-browser-multiplayer-online-/master/public/assets/zip.mp3'
);

class EmployeesTable extends React.Component {
  state = {
    employees: [],
    showUpdateModal: false,
    valueToUpdate: null
  };

  componentDidMount = () => {
    this.getEmployees();
  };

  getEmployees = async () => {
    try {
      const res = await axios.get(this.props.apiURL('/api/employees'));
      this.props.setLoadingSpinner(true);

      this.setState({
        employees: res.data,
        show: false
      });
    } catch (e) {
      console.log(e);
    }
  };

  toggleUpdateModal = () => {
    //helper function passed down to child to toggle modal
    this.setState({ showUpdateModal: false });
    this.playSound();
  };

  playSound = () => {
    zippi.play();
  };

  render() {
    const { employees } = this.state;

    const keys = ['id', 'name', 'code', 'profession', 'city', 'branch', 'assigned', 'color', 'actions'];

    const Columns = keys.map(key => {
      const upperCasedFirstLetter = key.charAt(0).toUpperCase() + key.substring(1);
      let returnValue = {
        Header: upperCasedFirstLetter,
        accessor: key
      };

      switch (key) {
        case 'id':
          returnValue['filterable'] = true;
          returnValue['Filter'] = ({ onChange }) => (
            <input onChange={event => onChange(event.target.value)} placeholder="🔍" />
          );
          break;
        case 'assigned':
          returnValue['Cell'] = props => (props.original.assigned ? 'Yes' : 'No');
          break;
        case 'color':
          returnValue['Cell'] = props => {
            let { color } = props.original;
            if (!colorCheckerHelper(color.toLowerCase())) {
              color = 'white'; // default color for invalid arguments
            }
            return (
              <div
                className="colorCol"
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: color,
                  borderRadius: '2px'
                }}
              ></div>
            );
          };
          break;
        case 'actions':
          returnValue['Cell'] = props => {
            return (
              <button
                onClick={async val => {
                  val.stopPropagation();
                  try {
                    await axios.delete(this.props.apiURL('/api/deleteEmployee'), {
                      params: { employeeId: props.original._id }
                    });

                    setTimeout(() => {
                      this.props.globalAlerts('Delete Successful');
                      poof.play();
                      this.getEmployees();
                    }, 100);
                  } catch (e) {
                    console.log(e);
                  }
                }}
                className="actionButtonDelete"
              >
                <span alt="delete" role="img" aria-label="delete">
                  🗑️
                </span>
              </button>
            );
          };
          break;
        default:
          // do nothing here.
          break;
      }

      return returnValue;
    });

    if (this.props.currentSpinnerMode) {
      return (
        <div className="Employees">
          <ReactTable
            className="table"
            defaultPageSize={10}
            data={employees}
            columns={Columns}
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: e => {
                  e.stopPropagation();
                  zip.play();
                  if (rowInfo && rowInfo.original) {
                    this.setState({
                      showUpdateModal: true,
                      valueToUpdate: rowInfo.original
                    });
                  }
                },
                onContextMenu: e => {
                  // on right click
                  e.preventDefault();
                  axios
                    .put(this.props.apiURL('/api/toggleAssigned'), {
                      _id: rowInfo.original._id,
                      toEnableOrDisable: !rowInfo.original.assigned
                    })
                    .then(res => {
                      setTimeout(() => {
                        this.props.globalAlerts('Successfully toggled!');
                        this.getEmployees();
                      }, 70);
                    });
                }
              };
            }}
          />
          <AddEmployeeButton
            globalAlerts={this.props.globalAlerts}
            getEmployees={this.getEmployees}
            playSound={this.playSound}
            apiURL={this.props.apiURL}
          />
          {this.state.showUpdateModal && (
            <UpdateEmployeeModal
              toggleUpdateModal={this.toggleUpdateModal}
              data={this.state.valueToUpdate}
              globalAlerts={this.props.globalAlerts}
              getEmployees={this.getEmployees}
              apiURL={this.props.apiURL}
            />
          )}
        </div>
      );
    }
    return <LoadingSpinner />;
  }
}

EmployeesTable.propTypes = {
  apiURL: propTypes.func,
  globalAlerts: propTypes.func
};

const mapStateToProps = state => {
  return { currentSpinnerMode: state.currentSpinnerMode };
};

export default connect(mapStateToProps, { setLoadingSpinner })(EmployeesTable);
