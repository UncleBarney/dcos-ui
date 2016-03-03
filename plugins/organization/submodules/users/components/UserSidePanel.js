import mixin from 'reactjs-mixin';
import React from 'react';
import {Confirm, SidePanel} from 'reactjs-components';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLUserStore from '../stores/ACLUserStore';
import HistoryStore from '../../../../../src/js/stores/HistoryStore';
import MesosSummaryStore from '../../../../../src/js/stores/MesosSummaryStore';
import UserSidePanelContents from './UserSidePanelContents';

const METHODS_TO_BIND = [
  'handleDeleteModalOpen',
  'handleDeleteCancel',
  'handlePanelClose',
  'handleDeleteUser'
];

class UserSidePanel extends mixin(StoreMixin) {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    this.state = {
      deleteUpdateError: null,
      openDeleteConfirmation: false,
      pendingRequest: false
    };

    this.store_listeners = [
      {
        name: 'user',
        events: [
          'deleteSuccess',
          'deleteError'
        ]
      }
    ];
  }

  handleDeleteCancel() {
    this.setState({
      openDeleteConfirmation: false
    });
  }

  handleDeleteModalOpen() {
    this.setState({
      deleteUpdateError: null,
      openDeleteConfirmation: true
    });
  }

  handleDeleteUser() {
    this.setState({
      pendingRequest: true
    });
    ACLUserStore.deleteUser(this.props.params.userID);
  }

  handlePanelClose(closeInfo) {
    if (!this.isOpen()) {
      return;
    }

    let router = this.context.router;

    if (closeInfo && closeInfo.closedByBackdrop) {
      router.transitionTo(this.props.openedPage, router.getCurrentParams());
      return;
    }

    HistoryStore.goBack(router);
  }

  onUserStoreDeleteError(error) {
    this.setState({
      deleteUpdateError: error,
      pendingRequest: false
    });
  }

  onUserStoreDeleteSuccess() {
    this.setState({
      openDeleteConfirmation: false,
      pendingRequest: false
    });

    this.context.router.transitionTo('settings-organization-users');
  }

  isOpen() {
    return (
      this.props.params.userID != null
      && MesosSummaryStore.get('statesProcessed')
    );
  }

  getDeleteModalContent() {
    let error = null;

    if (this.state.deleteUpdateError != null) {
      error = (
        <p className="text-error-state">{this.state.deleteUpdateError}</p>
      );
    }

    let user = ACLUserStore.getUser(this.props.params.userID);

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">Are you sure?</h3>
        <p>{`${user.description} will be deleted.`}</p>
        {error}
      </div>
    );
  }

  getHeader(userID) {
    return (
      <div className="side-panel-header-container">
        <div className="side-panel-header-actions
          side-panel-header-actions-primary">

          <span className="side-panel-header-action"
            onClick={this.handlePanelClose}>
            <i className={`icon icon-sprite
              icon-sprite-small
              icon-close
              icon-sprite-small-white`}></i>
            Close
          </span>

        </div>

        <div className="side-panel-header-actions
          side-panel-header-actions-secondary">
          {this.getHeaderDelete(userID)}
        </div>

      </div>
    );
  }

  getHeaderDelete(userID) {
    if (userID != null) {
      return (
        <span className="side-panel-header-action text-align-right"
          onClick={this.handleDeleteModalOpen}>
          Delete
        </span>
      );
    }

    return null;
  }

  getContents(userID) {
    if (!this.isOpen()) {
      return null;
    }

    return (
      <UserSidePanelContents
        itemID={userID}
        parentRouter={this.context.router} />
    );
  }

  render() {
    let userID = this.props.params.userID;

    return (
      <div>
        <SidePanel className="side-panel-detail"
          header={this.getHeader(userID)}
          headerContainerClass="container
            container-fluid container-fluid-narrow container-pod
            container-pod-short"
          bodyClass="side-panel-content flex-container-col"
          onClose={this.handlePanelClose}
          open={this.isOpen()}>
          {this.getContents(userID)}
        </SidePanel>
        <Confirm
          closeByBackdropClick={true}
          disabled={this.state.pendingRequest}
          footerContainerClass="container container-pod container-pod-short
            container-pod-fluid flush-top flush-bottom"
          open={this.state.openDeleteConfirmation}
          onClose={this.handleDeleteCancel}
          leftButtonCallback={this.handleDeleteCancel}
          rightButtonCallback={this.handleDeleteUser}
          rightButtonClassName="button button-danger"
          rightButtonText="Delete">
          {this.getDeleteModalContent()}
        </Confirm>
      </div>
    );
  }
}

UserSidePanel.contextTypes = {
  router: React.PropTypes.func
};

UserSidePanel.propTypes = {
  params: React.PropTypes.object
};

module.exports = UserSidePanel;