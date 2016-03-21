"use strict";

var React = require("react");

// External library for dates.
// var moment = require("moment");

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
            result.errorMsg = "Please enter a date same or after " + startDateObj.toDateString();
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
        if (this.props.startDateLimit || this.props.endDateLimit) {
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

    _onDateChange: function () {
        var changedDate = new Date(this.state.currentYear, this.state.currentMonth, this.state.currentDate);
        this.props.onChange(changedDate);
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

            // Call this.props.onChange with changed date.
            this._onDateChange();
        } else {
            // Invalid date. Set error msg and return.
            this.refs.inputBoxErrorMsg.innerHTML = dateCheck.errorMsg;
            return;
        }
    },

    _handleDateClick: function (type, e) {
        e.preventDefault();

        var changedDate = +e.target.innerHTML,
            changedMonth = this.state.currentMonth,
            changedYear = this.state.currentYear;

        switch (type) {
            case "prev":
                changedMonth = (this.state.currentMonth === 0) ? 11 : (this.state.currentMonth - 1);
                changedYear = (this.state.currentMonth === 0) ? (this.state.currentYear - 1) : this.state.currentYear;
                break;
            case "curr":
                // Do nothing.
                break;
            case "next":
                changedMonth = (this.state.currentMonth === 11) ? 0 : (this.state.currentMonth + 1);
                changedYear = (this.state.currentMonth === 11) ? (this.state.currentYear + 1) : this.state.currentYear;
                break;
            default:
                // Do nothing.
        }
        this._setDateValues(new Date(changedYear, changedMonth, changedDate).getDay(), changedDate, changedMonth, changedYear);

        // Call onChange when user clicks a date.
        this._onDateChange();
    },

    _handleCalendarButtons: function (directions, calendarType) {
        var changedMonth = null,
            changedYear = null;

        switch (calendarType) {
            case "month":
                switch (directions) {
                    case "prev":
                        changedMonth = (this.state.currentMonth === 0) ? 11 : (this.state.currentMonth - 1);
                        changedYear = (this.state.currentMonth === 0) ? (this.state.currentYear - 1) : this.state.currentYear;
                        break;
                    case "next":
                        changedMonth = (this.state.currentMonth === 11) ? 0 : (this.state.currentMonth + 1);
                        changedYear = (this.state.currentMonth === 11) ? (this.state.currentYear + 1) : this.state.currentYear;
                        break;
                    default:
                        // Do nothing.
                }
                break;
            case "year":
                changedMonth = this.state.currentMonth;
                switch (directions) {
                    case "prev":
                        changedYear = (this.state.currentYear - 1);
                        break;
                    case "next":
                        changedYear = (this.state.currentYear + 1);
                        break;
                    default:
                        // Do nothing.
                }
                // year cant be less than 1970. If it is less than 1970 do nothing.
                if (changedYear < 1970) { return; }
                break;
            default:
                // Do nothing.
        }
        this._setDateValues(new Date(changedYear, changedMonth, this.state.currentDate).getDay(), this.state.currentDate, changedMonth, changedYear);
    },

    _showDaysRow: function () {
        var daysRow = daysLabel.map(function (eachDay, idx) {
            return (<div key={idx} className="col">{eachDay}</div>);
        });

        return daysRow;
    },

    _showPreviousMonthDays: function () {
        var thisMonthStartDay = new Date(this.state.currentYear, this.state.currentMonth, 1).getDay(),
            previousMonth = (this.state.currentMonth === 0) ? 11 : (this.state.currentMonth - 1),
            previousYear = (this.state.currentMonth === 0) ? (this.state.currentYear - 1) : this.state.currentYear,
            previousMonthNoOfDays = checkLeapYear(previousMonth, previousYear) ? 29 : daysInMonth[previousMonth],
            day = (previousMonthNoOfDays - (thisMonthStartDay - 1)),
            dayBox = [],
            checkValidity = function (that, dateObj) {
                if (that.props.startDateLimit || that.state.endDateLimit) {
                    var check = that._checkIfDateIsWithinLimit(dateObj, that.props.startDateLimit, that.props.endDateLimit);
                    if (!check.validity) {
                        // If date is not in limit.
                        return false;
                    }
                }
                return true;
            };

        // Running a loop from 0 till thisMonthStartDate and filling previous month days.
        for (var i = 0; i < thisMonthStartDay; i++, day++) {
            var dateObj = new Date(this.state.currentYear, (this.state.currentMonth - 1), day);
            dayBox.push(<div key={dateObj.toString()} className={ "col prev-month" + (checkValidity(this, dateObj) ? "" : " expired") } onClick={this._handleDateClick.bind(this, "prev")}>
                        <span className="label">{day}</span>
                        </div>);
        }
        // Running a loop from thisMonthStartDay till 7 and filling this month days.
        day = 1; // Starting day again from 1. (ie: this month starting date)
        for (var i = thisMonthStartDay; i < 7; i++, day++) {
            var dayClassName = "col curr-month";
            var dateObj = new Date(this.state.currentYear, this.state.currentMonth, day);
            if (!checkValidity(this, dateObj)) {
                dayClassName += " expired"
            }
            if (day === this.state.currentDate) {
                dayClassName += " active";
            }
            dayBox.push(<div key={dateObj.toString()} className={dayClassName} onClick={this._handleDateClick.bind(this, "curr")}>
                            <span className="label">{day}</span>
                        </div>);
        }

        return (<div key="row-1" className="row">
                    {dayBox}
                </div>);
    },

    _showThisMonthAndNextMonthDays: function () {
        var thisMonthStartDay = new Date(this.state.currentYear, this.state.currentMonth, 1).getDay(),
            monthLength = checkLeapYear(this.state.currentMonth, this.state.currentYear) ? 29 : daysInMonth[this.state.currentMonth],
            nextMonthCheck = false,
            nextMonth = (this.state.currentMonth === 11) ? 0 : (this.state.currentMonth + 1),
            nextYear = (this.state.currentMonth === 11) ? (this.state.currentYear + 1) : this.state.currentYear,
            day = ((7 - thisMonthStartDay) + 1),
            dayRows = [],
            checkValidity = function (that, dateObj) {
                if (that.props.startDateLimit || that.state.endDateLimit) {
                    var check = that._checkIfDateIsWithinLimit(dateObj, that.props.startDateLimit, that.props.endDateLimit);
                    if (!check.validity) {
                        // If date is not in limit.
                        return false;
                    }
                }
                return true;
            };

            for (var i = 0; i < 5; i++) {
                var dayBox = [];
                for (var j = 0; j < 7; j++, day++) {
                    var dayClassName = "col curr-month";
                    if (day > monthLength) { day = 1; nextMonthCheck = true; dayClassName = "col next-month" }
                    if (nextMonthCheck) { dayClassName = "col next-month"; }
                    var dateObj = (nextMonthCheck) ? new Date(nextYear, nextMonth, day) : new Date(this.state.currentYear, this.state.currentMonth, day);
                    if (!checkValidity(this, dateObj)) {
                        dayClassName += " expired"
                    }
                    if (day === this.state.currentDate) {
                        dayClassName += " active";
                    }
                    dayBox.push(<div key={dateObj.toString()} className={dayClassName} onClick={this._handleDateClick.bind(this, ((nextMonthCheck) ? "next" : "curr"))}>
                            <span className="label">{day}</span>
                            </div>);
                }
                dayRows.push(<div key={"row-" + (i + 2)} className="row">{dayBox}</div>);
            }

        return dayRows;
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
                    <div className="calendar-display-container">
                        <div className="calendar-btn-group">
                            <div className="month-btn-group">
                                <span className="prev-btn" onClick={this._handleCalendarButtons.bind(this, "prev", "month")}></span>
                                <span className="label-btn">{monthsLabel[this.state.currentMonth]}</span>
                                <span className="next-btn" onClick={this._handleCalendarButtons.bind(this, "next", "month")}></span>
                            </div>
                            <div className="year-btn-group">
                                <span className="prev-btn" onClick={this._handleCalendarButtons.bind(this, "prev", "year")}></span>
                                <span className="label-btn">{this.state.currentYear}</span>
                                <span className="next-btn" onClick={this._handleCalendarButtons.bind(this, "next", "year")}></span>
                            </div>
                        </div>
                        <div className="table">
                            <div className="head">
                                <div className="row">
                                    {this._showDaysRow()}
                                </div>
                            </div>
                            <div className="body">
                                {this._showPreviousMonthDays()}
                                {this._showThisMonthAndNextMonthDays()}
                            </div>
                        </div>
                        <p className="error-msg" ref="calendarBoxErrorMsg"></p>
                    </div>
                </section>);
    }
});

module.exports = Calendar;
