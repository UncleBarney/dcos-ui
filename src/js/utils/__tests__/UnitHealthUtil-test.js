jest.dontMock('../../constants/UnitHealthStatus');

var HealthUnit = require('../../structs/HealthUnit');
var UnitHealthStatus = require('../../constants/UnitHealthStatus');
var UnitHealthUtil = require('../../utils/UnitHealthUtil');
let NodesList = require('../../structs/NodesList');

describe('UnitHealthUnit', function () {

  describe('#getHealthSorting', function () {
    beforeEach(function () {
      let unit = new HealthUnit({unit_health: 0, unit_id: 'aaa'});
      this.healthWeight = UnitHealthUtil.getHealthSorting(unit);
    });

    it('should return a number', function () {
      expect(typeof this.healthWeight).toEqual('number');
    });

  });

  describe('#getHealth', function () {

    it('returns a UnitHealthStatus object', function () {
      var health = 1;

      expect(UnitHealthUtil.getHealth(health)).toEqual({
        title: 'Unhealthy',
        value: 1,
        classNames: 'text-danger'
      });
    });

    it('returns NA when health not valid', function () {
      var health = 'wtf';
      expect(UnitHealthUtil.getHealth(health)).toEqual(UnitHealthStatus.NA);
    });

  });

  describe('#filterByHealth', function () {

    it('filters by unit health title', function () {
      let items = [
        {id: 'food', node_health: 0},
        {id: 'bard', node_health: 0},
        {id: 'bluh', node_health: 2}
      ];
      let list = new NodesList({items});
      let filteredList = list.filter({health: 'healthy'}).getItems();
      expect(filteredList.length).toEqual(2);
      expect(filteredList[0].get('id')).toEqual('food');
      expect(filteredList[1].get('id')).toEqual('bard');
    });
  });

});