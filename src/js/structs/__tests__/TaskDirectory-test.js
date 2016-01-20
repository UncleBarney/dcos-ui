jest.dontMock('../DirectoryItem');
jest.dontMock('../TaskDirectory');
jest.dontMock('../../utils/Util');

let DirectoryItem = require('../DirectoryItem');
let TaskDirectory = require('../TaskDirectory');

describe('TaskDirectory', function () {

  beforeEach(function () {
    let items = [{path: '/some/path/to/bar'}];
    this.directory = new TaskDirectory({items});
  });

  describe('#constructor', function () {

    it('creates instances of DirectoryItem', function () {
      let items = this.directory.getItems();
      expect(items[0] instanceof DirectoryItem).toBeTruthy();
    });

  });

  describe('#findFile', function () {

    it('should return undefined when item is not is list', function () {
      expect(this.directory.findFile('quis')).toEqual(undefined);
    });

    it('should return the file when item is not is list', function () {
      expect(this.directory.findFile('bar').get('path'))
        .toEqual('/some/path/to/bar');
    });

  });

});
