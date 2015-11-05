jest.dontMock("../DetailSidePanel");
jest.dontMock("../TaskSidePanel");
jest.dontMock("../TaskDirectoryView");
jest.dontMock("../../constants/TaskStates");
jest.dontMock("../../stores/MesosStateStore");
jest.dontMock("../../events/MesosStateActions");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../utils/Util");
jest.dontMock("../../utils/Store");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var MesosStateStore = require("../../stores/MesosStateStore");
var TaskSidePanel = require("../TaskSidePanel");

describe("TaskSidePanel", function () {
  beforeEach(function () {
    this.storeGet = MesosStateStore.get;
    this.storeChangeListener = MesosStateStore.addChangeListener;

    MesosStateStore.get = function (key) {
      if (key === "lastMesosState") {
        return {};
      }
    };

    MesosStateStore.addChangeListener = function () {};
    MesosStateStore.getTaskFromTaskID = function () {
      return {
        id: "fake id",
        state: "TASK_RUNNING"
      };
    };
  });

  afterEach(function () {
    MesosStateStore.get = this.storeGet;
    MesosStateStore.addChangeListener = this.storeChangeListener;
  });

  describe("#getContents", function () {
    it("should return null if there are no nodes", function () {
      var instance = TestUtils.renderIntoDocument(
        <TaskSidePanel open={true} />
      );
      expect(instance.getContents()).toEqual(null);
    });

    it("should return an element if there is a node", function () {
      MesosStateStore.get = function () {
        return {
          slaves: {fakeProp: "faked"}
        };
      };

      var instance = TestUtils.renderIntoDocument(
        <TaskSidePanel open={true} />
      );

      expect(TestUtils.isElement(instance.getContents())).toEqual(true);
    });
  });

  describe("#getBasicInfo", function () {
    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <TaskSidePanel open={false} />
      );
    });

    it("should return null if task is null", function () {
      var result = this.instance.getBasicInfo(null);
      expect(result).toEqual(null);
    });

    it("should return an element if task is not null", function () {
      var result = this.instance.getBasicInfo({
        id: "fade",
        state: "TASK_RUNNING"
      });
      expect(TestUtils.isElement(result)).toEqual(true);
    });
  });
});
