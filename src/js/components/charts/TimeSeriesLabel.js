/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var ValueTypes = require("../../constants/ValueTypes");

var TimeSeriesLabel = React.createClass({

  displayName: "TimeSeriesLabel",

  propTypes: {
    colorIndex: React.PropTypes.number,
    currentValue: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    subHeading: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    y: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      y: ValueTypes.PERCENTAGE,
      colorIndex: 0
    };
  },

  shouldComponentUpdate: function (nextProps) {
    return !_.isEqual(this.props, nextProps);
  },

  render: function () {
    var props = this.props;

    var percentageClassSet = React.addons.classSet({
      "hidden": props.y !== ValueTypes.PERCENTAGE
    });

    return (
      <div className="text-align-center">
        <span className="h1-jumbo unit">
          {props.currentValue}
          <sup className={percentageClassSet}>%</sup>
        </span>
        <span className={"h4 unit-label tall-bottom path-color-" + props.colorIndex}>
          {props.subHeading}
        </span>
      </div>
    );
  }
});

module.exports = TimeSeriesLabel;