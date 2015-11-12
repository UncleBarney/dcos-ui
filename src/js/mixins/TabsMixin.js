import classNames from "classnames";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

const TabsMixin = {
  tabs_getTabs() {
    let currentTab = this.state.currentTab;
    let tabs = this.tabs;

    return Object.keys(tabs).map(function (tab, i) {
      let classSet = classNames({
        "button button-link": true,
        "button-primary": currentTab === tab
      });

      return (
        <div
          key={i}
          className={classSet}
          onClick={this.tabs_handleTabClick.bind(this, tab)}>
          {tabs[tab]}
        </div>
      );
    }, this);
  },

  tabs_getTabView() {
    let currentTab = this.tabs[this.state.currentTab];
    let renderFunction = this[`render${currentTab}TabView`];

    if (renderFunction == null) {
      return null;
    }

    return renderFunction.apply(this);
  },

  tabs_handleTabClick(nextTab) {
    this.setState({currentTab: nextTab});
  }
};

export default TabsMixin;