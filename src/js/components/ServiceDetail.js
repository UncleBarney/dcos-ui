import {Confirm} from 'reactjs-components';
import mixin from 'reactjs-mixin';
import React from 'react';

import InternalStorageMixin from '../mixins/InternalStorageMixin';
import Service from '../structs/Service';
import ServiceActionItem from '../constants/ServiceActionItem';
import ServiceDetailConfigurationTab from './ServiceDetailConfigurationTab';
import ServiceDetailTaskTab from './ServiceDetailTaskTab';
import ServiceFormModal from './modals/ServiceFormModal';
import ServiceInfo from './ServiceInfo';
import ServiceScaleFormModal from './modals/ServiceScaleFormModal';
import ServicesBreadcrumb from './ServicesBreadcrumb';
import TabsMixin from '../mixins/TabsMixin';

const METHODS_TO_BIND = [
  'onActionsItemSelection',
  'onAcceptDestroyConfirmDialog',
  'onAcceptSuspendConfirmDialog',
  'onCancelDestroyConfirmDialog',
  'onCancelSuspendConfirmDialog',
  'onCloseScaleFormModal',
  'onCloseServiceFormModal'
];

class ServiceDetail extends mixin(InternalStorageMixin, TabsMixin) {

  constructor() {
    super(...arguments);

    this.tabs_tabs = {
      tasks: 'Tasks',
      configuration: 'Configuration',
      debug: 'Debug',
      logs: 'Logs'
    };

    this.state = {
      currentTab: Object.keys(this.tabs_tabs).shift(),
      isServiceFormModalShown: false,
      isServiceDestroyConfirmShown: false,
      isServiceScaleFormModalShown: false,
      isServiceSuspendConfirmShown: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onActionsItemSelection(item) {
    switch (item.id) {
      case ServiceActionItem.EDIT:
        this.setState({isServiceFormModalShown: true});
        break;
      case ServiceActionItem.DESTROY:
        this.setState({isServiceDestroyConfirmShown: true});
        break;
      case ServiceActionItem.SCALE:
        this.setState({isServiceScaleFormModalShown: true});
        break;
      case ServiceActionItem.SUSPEND:
        this.setState({isServiceSuspendConfirmShown: true});
        break;
    }
  }

  onAcceptDestroyConfirmDialog() {
    this.setState({isServiceDestroyConfirmShown: false});
  }

  onAcceptSuspendConfirmDialog() {
    this.setState({isServiceSuspendConfirmShown: false});
  }

  onCancelDestroyConfirmDialog() {
    this.setState({isServiceDestroyConfirmShown: false});
  }

  onCancelSuspendConfirmDialog() {
    this.setState({isServiceSuspendConfirmShown: false});
  }

  onCloseScaleFormModal() {
    this.setState({isServiceScaleFormModalShown: false});
  }

  onCloseServiceFormModal() {
    this.setState({isServiceFormModalShown: false});
  }

  getDestroyConfirmDialog() {
    const {service} = this.props;

    let message = (
      <div className="container-pod flush-top container-pod-short-bottom">
        <h2 className="text-danger text-align-center flush-top">Destroy Service</h2>
        <p>Are you sure you want to destroy {service.getId()}? This action is irreversible.</p>
      </div>
    );

    return  (
      <Confirm children={message}
        open={this.state.isServiceDestroyConfirmShown}
        onClose={this.onCancelDestroyConfirmDialog}
        leftButtonText="Cancel"
        leftButtonCallback={this.onCancelDestroyConfirmDialog}
        rightButtonText="Destroy Service"
        rightButtonClassName="button button-danger"
        rightButtonCallback={this.onAcceptDestroyConfirmDialog} />
    );
  }

  getSuspendConfirmDialog() {
    const {service} = this.props;

    let message = (
      <div className="container-pod flush-top container-pod-short-bottom">
        <h2 className="text-align-center flush-top">Suspend Service</h2>
        <p>Are you sure you want to suspend {service.getId()} by scaling to 0 instances?</p>
      </div>
    );

    return  (
      <Confirm children={message}
        open={this.state.isServiceSuspendConfirmShown}
        onClose={this.onCancelSuspendConfirmDialog}
        leftButtonText="Cancel"
        leftButtonCallback={this.onCancelSuspendConfirmDialog}
        rightButtonText="Suspend Service"
        rightButtonClassName="button button-primary"
        rightButtonCallback={this.onAcceptSuspendConfirmDialog} />
    );
  }

  getServiceScaleFormModal() {
    return (
      <ServiceScaleFormModal
        open={this.state.isServiceScaleFormModalShown}
        service={this.props.service}
        onClose={this.onCloseScaleFormModal} />
    );
  }

  renderConfigurationTabView() {
    return (
      <ServiceDetailConfigurationTab service={this.props.service} />
    );
  }

  renderDebugTabView() {
    return (<span>Debug Placeholder</span>);
  }

  renderLogsTabView() {
    return (<span>Logs Placeholder</span>);
  }

  renderTasksTabView() {
    return (
      <ServiceDetailTaskTab service={this.props.service} />
    );
  }

  render() {
    const {service} = this.props;

    return (
      <div className="flex-container-col">
        <div className="container-pod
          container-pod-divider-bottom-align-right
          container-pod-short-top flush-bottom flush-top
          service-detail-header media-object-spacing-wrapper
          media-object-spacing-narrow">
          <ServicesBreadcrumb serviceTreeItem={service} />
          <ServiceInfo onActionsItemSelection={this.onActionsItemSelection}
            service={service} tabs={this.tabs_getUnroutedTabs()} />
          {this.tabs_getTabView()}
        </div>
        <ServiceFormModal isEdit={true}
          open={this.state.isServiceFormModalShown}
          service={service}
          onClose={this.onCloseServiceFormModal} />
        {this.getDestroyConfirmDialog()}
        {this.getServiceScaleFormModal()}
        {this.getSuspendConfirmDialog()}
      </div>

    );
  }
}

ServiceDetail.contextTypes = {
  router: React.PropTypes.func
};

ServiceDetail.propTypes = {
  service: React.PropTypes.instanceOf(Service)
};

module.exports = ServiceDetail;
