var classNames = require('classnames');
var GeminiScrollbar = require('react-gemini-scrollbar');
var React = require('react');
import {StoreMixin} from 'mesosphere-shared-reactjs';

import GeminiUtil from '../utils/GeminiUtil';
var InternalStorageMixin = require('../mixins/InternalStorageMixin');
var SidebarToggle = require('../components/SidebarToggle');

var Page = React.createClass({

  displayName: 'Page',

  mixins: [InternalStorageMixin, StoreMixin],

  propTypes: {
    className: React.PropTypes.string,
    navigation: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string
    ]),
    title: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string
    ])
  },

  componentWillMount: function () {
    this.store_listeners = [
      {
        name: 'sidebar',
        events: ['widthChange']
      }
    ];
  },

  componentDidMount: function () {
    this.internalStorage_set({
      rendered: true
    });
    this.forceUpdate();
  },

  onSidebarStoreWidthChange: function () {
    GeminiUtil.updateWithRef(this.refs.pageRef);
  },

  getChildren: function () {
    var data = this.internalStorage_get();
    if (data.rendered === true) {
      return this.props.children;
    }
    return null;
  },

  getNavigation: function (navigation) {
    if (!navigation) {
      return null;
    }

    return (
      <div className="page-navigation-list">
        <div className="container container-fluid container-pod container-pod-short flush-bottom">
          {navigation}
        </div>
      </div>
    );
  },

  getPageHeader: function (title, navigation) {
    return (
      <div className="page-navigation">
        {this.getTitle(title)}
        {this.getNavigation(navigation, title)}
      </div>
    );
  },

  getTitle: function (title) {
    if (!title) {
      return null;
    } else if (React.isValidElement(title)) {
      return title;
    }

    return (
      <div className="page-navigation-context">
        <div className="container container-fluid container-pod container-pod-short">
          <h1 className="page-navigation-title inverse flush">
            <SidebarToggle />
            {title}
          </h1>
        </div>
      </div>
    );
  },

  render: function () {
    let {className, navigation, title} = this.props;

    let classSet = classNames('page flex-container-col', className);

    return (
      <div className={classSet}>
        {this.getPageHeader(title, navigation)}
        <GeminiScrollbar autoshow={true} className="page-content
          container-scrollable inverse" ref="pageRef">
          <div className="flex-container-col container container-fluid container-pod container-pod-short-top">
            {this.getChildren()}
          </div>
        </GeminiScrollbar>
      </div>
    );
  }
});

module.exports = Page;
