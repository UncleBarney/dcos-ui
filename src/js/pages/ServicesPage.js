import React from 'react';
import {RouteHandler} from 'react-router';

import Page from '../components/Page';
import RouterUtil from '../utils/RouterUtil';
import TabsMixin from '../mixins/TabsMixin';

var ServicesPage = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [TabsMixin],

  displayName: 'ServicesPage',

  statics: {
    routeConfig: {
      label: 'Services',
      icon: 'services',
      matches: /^\/services/
    }
  },

  getInitialState: function () {
    return {
      currentTab: 'services-page'
    };
  },

  componentWillMount: function () {
    this.tabs_tabs = {
      'services-page': 'Services',
      'services-deployments': 'Deployments'
    };
    this.updateCurrentTab();
  },

  updateCurrentTab: function () {
    let routes = this.context.router.getCurrentRoutes();
    let currentTab = routes[routes.length - 1].name;
    if (currentTab != null) {
      this.setState({currentTab});
    }
  },

  getNavigation: function () {
    if (RouterUtil.shouldHideNavigation(this.context.router)) {
      return null;
    }

    return (
      <ul className="tabs list-inline flush-bottom inverse">
        {this.tabs_getRoutedTabs()}
      </ul>
    );
  },

  render: function () {
    return (
      <Page
        navigation={this.getNavigation()}
        title="Services">
        <RouteHandler />
      </Page>
    );
  }

});

module.exports = ServicesPage;
