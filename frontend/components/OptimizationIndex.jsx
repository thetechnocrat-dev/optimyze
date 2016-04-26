var React = require('react');
var OptimizationStore = require('../stores/optimizations');
var OptimizationActions = require('../actions/optimizationActions');
var OptimizationIndexItem = require('./optimizationIndexItem');
var RightHeader = require('./rightHeader');
var AuthStore = require('../stores/authStore');
var History = require('react-router').History;

// Style
var Menu = require('material-ui/lib/menus/menu');

var OptimizationsIndex = React.createClass({
  mixins: [History],

  getInitialState: function () {
    if (AuthStore.isSignedIn()) {
      return { optimizations: OptimizationStore.allForCurrentUser() };
    } else {
      return { optimizations: OptimizationStore.all() };
    }
  },

  _onChange: function () {
    this.setState({ optimizations: OptimizationStore.allWithSearchParams(this.props.searchParams) });
  },

  componentDidMount: function () {
    this.optimizationToken = OptimizationStore.addListener(this._onChange);
    OptimizationActions.retrieveAllOptimizations();
  },

  componentWillUnmount: function () {
    this.optimizationToken.remove();
  },

  clickNewOptimization: function () {
    if (AuthStore.isSignedIn()) {
      this.history.push('optimizations/form/new');
    } else {
      this.history.push('auth');
    }
  },

  createOptimizationList: function () {
    var _this = this;
    var listOfOptimizations = this.state.optimizations.reverse().map(function (el, idx) {
      return (
        <OptimizationIndexItem isUserOnly={AuthStore.isSignedIn()} key={idx} optimization={el} />
      );
    });

    return listOfOptimizations;
  },

  render: function () {
    return (
      <div>
        <RightHeader />
        <Menu>
          {this.createOptimizationList()}
        </Menu>
      </div>
    );
  },

});

module.exports = OptimizationsIndex;
