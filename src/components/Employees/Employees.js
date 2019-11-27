import React, { Component } from "react";

import "./Employees.css";
import "react-table/react-table.css";

import axios from "axios";
import ReactTable from "react-table";

import AddEmployeeButton from "../AddEmployeeButton/AddEmployeeButton";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import UpdateEmployeeModal from "../UpdateEmployeeModal/UpdateEmployeeModal";

class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      dataLoaded: false,
      showUpdateModal: false,
      valueToUpdate: null
    };
  }

  componentDidMount = () => {
    // get data when component is mounted
    this.getEmployees();
  };

  getEmployees() {
    // Axios call to get all employees from back-end
    this.getEmployees = this.getEmployees.bind(this);

    axios
      .get("http://localhost:8080/api/employees", {
        headers: { "content-type": "application/x-www-form-urlencoded" }
      })
      .then(response => {
        // handle success
        this.setState({
          employees: response.data,
          show: false,
          dataLoaded: true
        });
      })
      .catch(err => console.log(err));
  }

  toggleUpdateModal = () => {
    //helper function passed down to child to toggle modal
    this.setState({ showUpdateModal: false });
  };

  render() {
    const { employees } = this.state;

    const columns = [
      // react.table component prop value
      {
        Header: "ID",
        accessor: "id",
        filterable: true
      },
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Code",
        accessor: "code"
      },
      {
        Header: "Profession",
        accessor: "profession"
      },
      {
        Header: "city",
        accessor: "city"
      },
      {
        Header: "Branch",
        accessor: "branch"
      },
      {
        Header: "Asigned",
        Cell: props => {
          let asignedValue = props.original.assigned;
          return asignedValue ? "Yes" : "No";
        }
      },
      {
        Header: "color",
        Cell: props => {
          let color = props.original.color;
          return (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: color,
                borderRadius: "2px"
              }}
            ></div>
          );
        }
      },
      {
        Header: "Actions",
        Cell: props => {
          return (
            <button
              onClick={val => {
                console.log("Deleting:");
                console.log(props.original._id);
                axios
                  .delete("http://localhost:8080/api/deleteEmployee", {
                    params: { employeeId: props.original._id }
                  })
                  .then(response => {
                    setTimeout(() => {
                      console.log(response);
                      this.props.globalAlerts("Delete Successful");

                      this.getEmployees();
                    }, 50);
                  });
              }}
              className="actionButtonDelete"
            >
              Delete
            </button>
          );
        }
      }
    ];

    if (this.state.dataLoaded) {
      return (
        <div className="Employees">
          <ReactTable
            className="table"
            data={employees}
            columns={columns}
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  if (rowInfo && rowInfo.original) {
                    this.setState({
                      showUpdateModal: true,
                      valueToUpdate: rowInfo.original
                    });
                  }
                }
              };
            }}
          />
          <AddEmployeeButton
            globalAlerts={this.props.globalAlerts}
            getEmployees={this.getEmployees}
          />
          {this.state.showUpdateModal && (
            <UpdateEmployeeModal
              toggleUpdateModal={this.toggleUpdateModal}
              data={this.state.valueToUpdate}
              globalAlerts={this.props.globalAlerts}
              getEmployees={this.getEmployees}
            />
          )}
        </div>
      );
    } else {
      // display loading spinner while data is loading
      return <LoadingSpinner />;
    }
  }
}

export default Employees;
