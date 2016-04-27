var React = require('react');
var AuthStore = require('../stores/authStore');
var AuthActions = require('../actions/authActions');
var History = require('react-router').History;

// style
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup =  require('material-ui/lib/toolbar/toolbar-group');
var ToolbarTitle = require('material-ui/lib/toolbar/toolbar-title');
var FlatButton = require('material-ui/lib/flat-button');
var Dialog = require('material-ui/lib/dialog');
var Paper = require('material-ui/lib/paper');
var TextField = require('material-ui/lib/text-field');
var Style = require('../util/styleObj');

// components
var SignInUpForm = require('../components/signInUpForm');

var Header = React.createClass({
  mixins: [History],

  getInitialState: function () {
    return { open: false, authPath: '', searchParams: OptimizationStore.allSearchParams() };
  },

  _onChange: function () {
    this.forceUpdate();
  },

  componentDidMount: function () {
    this.authToken = AuthStore.addListener(this._onChange);
    this.searchToken = OptimizationStore.addListener(this._onChange);
  },

  componentWillUnmount: function () {
    this.authToken.remove();
    this.searchToken.remove();
  },

  signOut: function () {
    AuthActions.signOut();
  },

  navigateToRoot: function () {
    this.history.push('/');
  },

  makeHeaderList: function () {
    if (AuthStore.isSignedIn()) {
      return (
        <ToolbarGroup float='right'>
          <ToolbarTitle
            text={'Hi, ' + AuthStore.currentUser().username}
            style={Style.navBarText}
          />
          <FlatButton
            label='Sign Out'
            onTouchTap={this.signOut}
            style={Style.navBarButton}
            hoverColor='#A7FFEB'
            rippleColor='#1DE9B6'
          />
        </ToolbarGroup>
    );
    } else {
      return (
          <ToolbarGroup float='right'>
            <FlatButton
              label='Sign In'
              onTouchTap={this.handleSignInUpOpen.bind(null, 'signIn')}
              style={Style.navBarButton}
              hoverColor='#A7FFEB'
              rippleColor='#1DE9B6'
            />
            <FlatButton
              label='Sign Up'
              onTouchTap={this.handleSignInUpOpen.bind(null, 'signUp')}
              style={Style.navBarButton}
              hoverColor='#A7FFEB'
              rippleColor='#1DE9B6'
            />
          </ToolbarGroup>
        );
    }
  },

  handleSignInUpOpen: function (path) {
    this.setState({ open: true, authPath: path });
  },

  handleSignInUpClose: function () {
    this.setState({ open: false, authPath: '' });
  },

  handleInput: function (e) {
    e.preventDefault();
    OptimizationActions.receiveSearchParam('title', e.currentTarget.value);
  },

  render: function () {

    return (
      <Paper style={Style.navBarContainer}>
        <Toolbar style={Style.navBar}>
          <ToolbarGroup firstChild={true}>
            <FlatButton
              label='Optimyze'
              style={Style.logo}
              hoverColor='white'
              rippleColor='white'
              onTouchTap={this.navigateToRoot}
            />
          </ToolbarGroup>

          <ToolbarGroup>
            <TextField
              hintText='search optimyze'
              onChange={this.handleInput}
              value={this.state.searchParams.title}
              style={Style.searchBar}
              underlineFocusStyle={{ borderColor: '#00BFA5' }}
            />
          </ToolbarGroup>

          {this.makeHeaderList()}

          <Dialog
            actions={<SignInUpForm
                        closeModal={this.handleSignInUpClose}
                        authPath={this.state.authPath}
                    />}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleSignInUpClose}
          />
        </Toolbar>
      </Paper>
    );
  },

});

module.exports = Header;
