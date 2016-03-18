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
            "startDateLimit": new Date(),
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
        return (<section>
                    <h1>I am calendar</h1>
                </section>);
    }
});

module.exports = Calendar;
