import mixin from 'reactjs-mixin';
import React from 'react';

import InternalStorageMixin from '../mixins/InternalStorageMixin';
import Service from '../structs/Service';
import ServiceActionItem from '../constants/ServiceActionItem';
import ServiceDetailConfigurationTab from './ServiceDetailConfigurationTab';
import ServiceDetailTaskTab from './ServiceDetailTaskTab';
import ServiceDetailVolumesTab from './ServiceDetailVolumesTab';
import ServiceFormModal from './modals/ServiceFormModal';
import ServiceInfo from './ServiceInfo';
import ServiceVolumeTable from './ServiceVolumeTable';
import ServicesBreadcrumb from './ServicesBreadcrumb';
import TabsMixin from '../mixins/TabsMixin';

const METHODS_TO_BIND = [
  'onActionsItemSelection',
  'onCloseServiceFormModal'
];

class ServiceDetail extends mixin(InternalStorageMixin, TabsMixin) {

  constructor() {
    super(...arguments);

    this.tabs_tabs = {
      tasks: 'Tasks',
      configuration: 'Configuration',
      debug: 'Debug'
    };

    this.state = {
      currentTab: Object.keys(this.tabs_tabs).shift(),
      isServiceFormModalShown: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    this.checkForVolumes();
  }

  componentWillUpdate() {
    this.checkForVolumes();
  }

  onActionsItemSelection(item) {
    if (item.id === ServiceActionItem.EDIT) {
      this.setState({isServiceFormModalShown: true});
    }
  }

  onCloseServiceFormModal() {
    this.setState({isServiceFormModalShown: false});
  }

  checkForVolumes() {
    // Add the Volumes tab if it isn't already there and the service has
    // at least one volume.
    if (this.tabs_tabs.volumes == null
      && this.props.service.getVolumes().getItems().length > 0) {
      this.tabs_tabs.volumes = 'Volumes';
      this.forceUpdate();
    }
  }

  renderConfigurationTabView() {
    return (
      <ServiceDetailConfigurationTab service={this.props.service}/>
    );
  }

  renderDebugTabView() {
    return (<span>Debug Placeholder</span>);
  }

  renderVolumesTabView() {
    return (
      <ServiceVolumeTable
        params={this.context.router.getCurrentParams()}
        volumes={this.props.service.getVolumes().getItems()} />
    );
  }

  renderTasksTabView() {
    return (
      <ServiceDetailTaskTab service={this.props.service}/>
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
