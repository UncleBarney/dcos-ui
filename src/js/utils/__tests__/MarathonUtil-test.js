jest.dontMock('../MarathonUtil');

var MarathonUtil = require('../MarathonUtil');

describe('MarathonUtil', function () {

  describe('#parseGroups', function () {

    it('should throw error if the provided id doesn\'t start with a slash',
      function () {
        expect(function () {
          MarathonUtil.parseGroups({id: 'malformed/id'});
        }.bind(this)).toThrow();
      }
    );

    it('should throw error if an app id doesn\'t start with a slash',
      function () {
        expect(function () {
          MarathonUtil.parseGroups({id: '/', apps: [{id: 'malformed/id'}]});
        }.bind(this)).toThrow();
      }
    );

    it('should throw error if the provided id ends with a slash',
      function () {
        expect(function () {
          MarathonUtil.parseGroups({id: '/malformed/id/'});
        }.bind(this)).toThrow();
      }
    );

    it('should throw error if an app id ends with a slash',
      function () {
        expect(function () {
          MarathonUtil.parseGroups({id: '/', apps: [{id: '/malformed/id/'}]});
        }.bind(this)).toThrow();
      }
    );

    it('should not throw error if the provided id is only a slash (root id)',
      function () {
        expect(function () {
          MarathonUtil.parseGroups({id: '/'});
        }.bind(this)).not.toThrow();
      }
    );

    it('should throw error if an app id is only a slash (root id)',
      function () {
        expect(function () {
          MarathonUtil.parseGroups({id: '/', apps: [{id: '/'}]});
        }.bind(this)).toThrow();
      }
    );

    it('converts groups to tree', function () {
      var instance = MarathonUtil.parseGroups({
        id: '/',
        apps: [{id: '/alpha'}],
        groups: [{id: '/foo', apps: [{id: '/foo/beta'}]}]
      });

      expect(instance).toEqual({
        id: '/',
        items: [{id: '/foo', items: [{id: '/foo/beta'}]}, {id: '/alpha'}]
      });
    });

    it('correctly parses external volumes', function () {
      var instance = MarathonUtil.parseGroups({
        id: '/',
        apps: [{
          id: '/alpha', container: {
            volumes: [{
              containerPath: 'path',
              external: {
                size: 2048,
                name: 'volume-name',
                options: {'volume/driver': 'value'},
                provider: 'volume-provide'
              },
              mode: 'RW'
            }]
          }
        }]
      });

      expect(instance.items[0].volumes[0]).toEqual({
        containerPath: 'path',
        id: 'volume-name',
        name: 'volume-name',
        mode: 'RW',
        options: {'volume/driver': 'value'},
        provider: 'volume-provide',
        size: 2048,
        status: 'Unavailable',
        type: 'External'
      });
    });

    it('correctly parses persistent volumes', function () {
      var instance = MarathonUtil.parseGroups({
        id: '/',
        apps: [{
          id: '/alpha', container: {
            volumes: [{
              containerPath: 'path',
              mode: 'RW',
              persistent: {
                size: 2048
              }
            }]
          },
          tasks: [
            {
              host: '0.0.0.1',
              startedAt: '2016-06-03T16:22:30.282Z',
              localVolumes: [{
                containerPath: 'path',
                persistenceId: 'volume-id'
              }]
            }]
        }]
      });

      expect(instance.items[0].volumes[0]).toEqual({
        containerPath: 'path',
        host: '0.0.0.1',
        id: 'volume-id',
        mode: 'RW',
        size: 2048,
        status: 'Attached',
        type: 'Persistent'
      });
    });

    it('correctly determine persistent volume attached status', function () {
      var instance = MarathonUtil.parseGroups({
        id: '/',
        apps: [{
          id: '/alpha', container: {
            volumes: [{
              containerPath: 'path',
              mode: 'RW',
              persistent: {
                size: 2048
              }
            }]
          },
          tasks: [
            {
              host: '0.0.0.1',
              startedAt: '2016-06-03T16:22:30.282Z',
              localVolumes: [{
                containerPath: 'path',
                persistenceId: 'volume-id'
              }]
            }]
        }]
      });

      expect(instance.items[0].volumes[0].status).toEqual('Attached');
    });

    it('correctly determine persistent volume detached status', function () {
      var instance = MarathonUtil.parseGroups({
        id: '/',
        apps: [{
          id: '/alpha', container: {
            volumes: [{
              containerPath: 'path',
              mode: 'RW',
              persistent: {
                size: 2048
              }
            }]
          },
          tasks: [
            {
              host: '0.0.0.1',
              localVolumes: [{
                containerPath: 'path',
                persistenceId: 'volume-id'
              }]
            }
          ]
        }]
      });

      expect(instance.items[0].volumes[0].status).toEqual('Detached');
    });

    it('doesn\'t throw when localVolumes is null', function () {
      var instance = MarathonUtil.parseGroups.bind(MarathonUtil, {
        id: '/',
        apps: [{
          id: '/alpha', container: {
            volumes: [{
              containerPath: 'path',
              mode: 'RW',
              persistent: {
                size: 2048
              }
            }]
          },
          tasks: [
            {
              host: '0.0.0.1',
              localVolumes: null
            }
          ]
        }]
      });

      expect(instance).not.toThrow();
    });

    it('doesn\'t throw when localVolumes is not present', function () {
      var instance = MarathonUtil.parseGroups.bind(MarathonUtil, {
        id: '/',
        apps: [{
          id: '/alpha', container: {
            volumes: [{
              containerPath: 'path',
              mode: 'RW',
              persistent: {
                size: 2048
              }
            }]
          },
          tasks: [
            {
              host: '0.0.0.1'
            }
          ]
        }]
      });

      expect(instance).not.toThrow();
    });

    it('doesn\'t adds volumes array to all services', function () {
      var instance = MarathonUtil.parseGroups({
        id: '/',
        apps: [{id: '/alpha'}]
      });

      expect(instance.items[0]).toEqual({id: '/alpha'});
    });

  });

});
