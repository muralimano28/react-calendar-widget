"use strict";

var React = require("react");

// Global variables
var daysLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    monthsLabel = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    checkLeapYear = function (month, year) {
        if (month == 1) { // February only!
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0){
                return true;
            }
        }
        return false;
    };


var Calendar = React.createClass({
    _checkIfDateIsWithinLimit: function (dateObj, startDateObj, endDateObj) {
        // Calculate startDateLimit, endDateLimit and dateObj in milliseconds.
        // Check if dateObj is within startDateLimit and endDateLimit.

        // If dateObj is empty then return.
        if (!dateObj) { return; }

        var dateObjInMS = dateObj.getTime(),
            startDateObjInMS = (startDateObj) ? startDateObj.getTime() : null,
            endDateObjInMS = (endDateObj) ? endDateObj.getTime() : null,
            result = {"validity": true, "errorMsg": ""};

        if (startDateObjInMS && dateObjInMS < startDateObjInMS) {
            result.validity = false;
            result.errorMsg = "Please enter date same or after " + startDateObj.toDateString();
            return result;
        }
        if (endDateObjInMS && dateObjInMS > endDateObjInMS) {
            result.validity = false;
            result.errorMsg = "Please enter a date same or before " + endDateObj.toDateString();
            return result;
        }
        // Passes the test and return result with validity as true and empty error msg.
        return result;
    },

    _checkDateIsValid: function (date, month, year) {
        // Things to check:
        // 1. Check if enteredDate array length is greater than 3.
        // 2. Check if date is greater than 0 and less than or equal to 31.
        // 3. Check if month is greater than 0 and less than or equal to 12.
        // 4. Check if year is 4 digit and greater than or equal to 1970.
        // 5. If startDateLimit and endDateLimit is given, then check if entered date is within the limit.

        var result = {"validity": true, "errorMsg": ""},
            dateObj = new Date(year, month, date);

        // Checking if date and month and year is of type integer.
        if (isNaN(date) || isNaN(month) || isNaN(year)) {
            result.validity = false;
            result.errorMsg = "Please enter date in DD/MM/YYYY format.";
            return result;
        }
        // Checking if date is within 1 and 31.
        if (date <= 0 || date >= 32) {
            result.validity = false;
            result.errorMsg = "Please enter proper date. Date value should be within 1 and 31.";
            return result;
        }
        // Checking if month is within 1 and 12.
        if (month <=0 || month >= 13) {
            result.validity = false;
            result.errorMsg = "Please enter proper month. Month value should be within 1 and 12.";
            return result;
        }
        // Checking if year is greater than or equal to 1970.
        if (year < 1970 ) {
            result.validity = false;
            result.errorMsg = "Please enter proper year. Year should be greater than 1970.";
            return result;
        }
        // Checking if date is within startdate and enddate limit.
        if (this.props.startDateLimit && this.props.endDateLimit) {
            var check = this._checkIfDateIsWithinLimit(dateObj, this.props.startDateLimit, this.props.endDateLimit);
            if (!check.validity) {
                result.validity = false;
                result.errorMsg = check.errorMsg;
                return result;
            }
        }
        // Passes the test. Send validity as true and errorMsg as empty.
        return result;
    },

    _setDateValues: function (day, date, month, year) {
        // Setting state with new date values.
        this.setState({
            "currentDay": day,
            "currentDate": date,
            "currentMonth": month,
            "currentYear": year
        });
    },

    _onEnteringDate: function (e) {
        e.preventDefault();

        // Taking input values and testing if it is a valid date and checking if it is of expected format.
        var enteredDate = e.target.value.split("/"),
            date = +enteredDate[0],
            month = +enteredDate[1],
            year = +enteredDate[2];

        var dateCheck = this._checkDateIsValid(date, month, year);

        if (dateCheck.validity) {
            // Valid date. Clear error msg and set state with user entered date.
            this.refs.inputBoxErrorMsg.innerHTML = dateCheck.errorMsg;
            this._setDateValues(new Date(year, (month - 1), date).getDay(), date, (month - 1), year);
        } else {
            // Invalid date. Set error msg and return.
            this.refs.inputBoxErrorMsg.innerHTML = dateCheck.errorMsg;
            return;
        }
    },

    getInitialState: function () {
        return ({
            "currentDay":  null, // Stores day of the week (from 0 - 6)
            "currentDate": null, // Stores day of the month (from 1 - 31)
            "currentMonth": null, // Stores month (from 0 - 11)
            "currentYear": null // Stores year
        });
    },

    getDefaultProps: function () {
        return ({
            "defaultDate": new Date(),
            "startDateLimit": null,
            "endDateLimit": null,
            "onChange": function() {}
        });
    },

    componentWillMount: function () {
        // Storing states based on the input props.
        this.setState({
            "currentDay": this.props.defaultDate.getDay(),
            "currentDate": this.props.defaultDate.getDate(),
            "currentMonth": this.props.defaultDate.getMonth(),
            "currentYear": this.props.defaultDate.getFullYear()
        });
    },
    render: function () {
        console.log("this.state: ", this.state);
        return (<section className="calendar-container">
                    <div className="date-input-container">
                        <input type="text" className="input-box" placeholder="DD/MM/YYYY" onChange={this._onEnteringDate}/>
                        <p className="error-msg" ref="inputBoxErrorMsg"></p>
                    </div>
                    <div className="calendar">
                    </div>
                </section>);
    }
});

module.exports = Calendar;
