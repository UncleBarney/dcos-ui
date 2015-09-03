import _ from "underscore";
import React from "react/addons";
import {Link} from "react-router";

import EventTypes from "../constants/EventTypes";
import HealthSorting from "../constants/HealthSorting";
import HostTimeSeriesChart from "../components/charts/HostTimeSeriesChart";
import InternalStorageMixin from "../mixins/InternalStorageMixin";
import MarathonStore from "../stores/MarathonStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import Page from "../components/Page";
import Panel from "../components/Panel";
import ResourceTimeSeriesChart from "../components/charts/ResourceTimeSeriesChart";
import TaskFailureTimeSeriesChart from "../components/charts/TaskFailureTimeSeriesChart";
import ServiceList from "../components/ServiceList";
import TasksChart from "../components/charts/TasksChart";
import ServiceSidePanel from "../components/ServiceSidePanel";
import SidebarActions from "../events/SidebarActions";

function getMesosState() {
  return {
    allocResources: MesosSummaryStore.getAllocResources(),
    // Need clone, modifying in place will make update components check for
    // change in the same array, in stead of two different references
    taskFailureRate: _.clone(MesosSummaryStore.get("taskFailureRate")),
    hostsCount: MesosSummaryStore.getActiveHostsCount(),
    refreshRate: MesosSummaryStore.getRefreshRate(),
    services: MesosSummaryStore.getLatest().frameworks,
    tasks: MesosSummaryStore.getTaskTotals(),
    totalResources: MesosSummaryStore.getTotalResources()
  };
}

var DashboardPage = React.createClass({

  displayName: "DashboardPage",

  mixins: [InternalStorageMixin],

  statics: {
    routeConfig: {
      label: "Dashboard",
      icon: "dashboard",
      matches: /^\/dashboard/
    },

    // Static life cycle method from react router, that will be called
    // "when a handler is about to render", i.e. on route change:
    // https://github.com/rackt/react-router/
    // blob/master/docs/api/components/RouteHandler.md
    willTransitionTo: function () {
      SidebarActions.close();
    }
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      servicesListLength: 5
    };
  },

  componentWillMount: function () {
    this.internalStorage_set(getMesosState());
  },

  componentDidMount: function () {
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
    MarathonStore.addChangeListener(
      EventTypes.MARATHON_APPS_CHANGE,
      this.onMarathonStateChange
    );
  },

  componentWillUnmount: function () {
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      this.onMesosStateChange
    );
    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_CHANGE,
      this.onMarathonStateChange
    );
  },

  onMarathonStateChange: function () {
    this.forceUpdate();
  },

  onMesosStateChange: function () {
    this.internalStorage_set(getMesosState());
    this.forceUpdate();
  },

  handleSideBarClose: function () {
    this.context.router.transitionTo("dashboard");
  },

  getServicesList: function (_services) {
    // Pick out only the data we need.
    let services = _.map(_services, function (service) {
      return _.pick(service, "name", "webui_url", "TASK_RUNNING", "id");
    });

    let sortedServices = _.sortBy(services, function (service) {
      let health = MarathonStore.getServiceHealth(service.name);
      if (health && health.key) {
        return HealthSorting[health.key];
      } else {
        return HealthSorting.NA;
      }
    });

    return _.first(sortedServices, this.props.servicesListLength);
  },

  getViewAllServicesBtn: function () {
    var data = this.internalStorage_get();
    var servicesCount = data.services.length;
    if (!servicesCount) {
      return null;
    }

    var textContent = "View all ";
    if (servicesCount > this.props.servicesListLength) {
      textContent += servicesCount + " ";
    }
    textContent += "Services >";

    return (
      <Link to="services"
        className="button button-small button-wide button-inverse more-button">
        {textContent}
      </Link>
    );
  },

  render: function () {
    let data = this.internalStorage_get();
    let appsProcessed = MarathonStore.hasProcessedApps();
    let serviceName = this.props.params.serviceName;

    return (
      <Page title="Dashboard">
        <div className="grid row">
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="CPU Allocation" className="dashboard-panel">
              <ResourceTimeSeriesChart
                allocResources={data.allocResources}
                totalResources={data.totalResources}
                mode="cpus"
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Memory Allocation" className="dashboard-panel">
              <ResourceTimeSeriesChart
                colorIndex={3}
                allocResources={data.allocResources}
                totalResources={data.totalResources}
                mode="mem"
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Task Failure Rate" className="dashboard-panel">
              <TaskFailureTimeSeriesChart
                data={data.taskFailureRate}
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Services Health" className="dashboard-panel">
              <ServiceList
                healthProcessed={appsProcessed}
                services={this.getServicesList(data.services)} />
              {this.getViewAllServicesBtn()}
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Tasks" className="dashboard-panel">
              <TasksChart tasks={data.tasks} />
            </Panel>
          </div>
          <div className="grid-item column-small-6 column-large-4 column-x-large-3">
            <Panel title="Nodes" className="dashboard-panel">
              <HostTimeSeriesChart
                data={data.hostsCount}
                refreshRate={data.refreshRate} />
            </Panel>
          </div>
        </div>
        <ServiceSidePanel
          open={serviceName != null}
          serviceName={serviceName}
          onClose={this.handleSideBarClose} />
      </Page>
    );
  }

});

module.exports = DashboardPage;
