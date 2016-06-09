import {Route} from 'react-router';

import DeploymentsTab from '../pages/services/DeploymentsTab';
import ServiceOverlay from '../components/ServiceOverlay';
import ServicesPage from '../pages/ServicesPage';
import ServicesTab from '../pages/services/ServicesTab';
import ServiceVolumeDetail from '../components/ServiceVolumeDetail';
import TaskDetail from '../components/TaskDetail';

let serviceRoutes = {
  type: Route,
  name: 'services-page',
  handler: ServicesPage,
  path: '/services/?',
  children: [
    {
      type: Route,
      name: 'services-deployments',
      path: 'deployments/',
      handler: DeploymentsTab
    },
    {
      type: Route,
      handler: ServicesTab,
      children: [
        {
          type: Route,
          name: 'services-detail',
          path: ':id/?',
          children: [
            {
              type: Route,
              name: 'services-task-details',
              path: 'task-detail/:taskID/?',
              handler: TaskDetail,
              children: [
                {
                  type: Route,
                  name: 'services-task-volume-details',
                  path: 'volume/:volumeID/?',
                  handler: ServiceVolumeDetail
                }
              ]
            },
            {
              type: Route,
              name: 'services-volume-details',
              path: 'volume/:volumeID/?',
              handler: ServiceVolumeDetail
            }
          ]
        },
        {
          type: Route,
          name: 'service-ui',
          path: 'ui/:serviceName/?',
          handler: ServiceOverlay
        },
        {
          type: Route,
          name: 'services-panel',
          path: 'service-detail/:serviceName/?'
        }
      ]
    }
  ]
};

module.exports = serviceRoutes;
