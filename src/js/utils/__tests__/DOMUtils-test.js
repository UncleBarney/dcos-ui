jest.dontMock("../DOMUtils");

var DOMUtils = require("../DOMUtils");

describe("DOMUtils", function () {

  describe("#getComputedWidth", function () {
    function buildElement (style) {
      return "<div style=\"" + style.join(";") + "\"></div>";
    }

    beforeEach(function () {
      this.style = [
        "width: 100px"
      ];
    });

    it("calculates left padding", function () {
      this.style.push("padding-left: 1px");
      document.body.innerHTML = buildElement(this.style);

      // jsdom doesn't calculate
      document.querySelector("div").offsetWidth = 101;

      var width = DOMUtils.getComputedWidth(document.querySelector("div"));
      expect(width).toEqual(100);
    });

    it("calculates right padding", function () {
      this.style.push("padding-right: 1px");
      document.body.innerHTML = buildElement(this.style);
      document.querySelector("div").offsetWidth = 101;

      var width = DOMUtils.getComputedWidth(document.querySelector("div"));
      expect(width).toEqual(100);
    });

    it("calculates left border", function () {
      this.style.push("border-left-width: 1px");
      document.body.innerHTML = buildElement(this.style);
      document.querySelector("div").offsetWidth = 101;

      var width = DOMUtils.getComputedWidth(document.querySelector("div"));
      expect(width).toEqual(100);
    });

    it("calculates right border", function () {
      this.style.push("border-right-width: 1px");
      document.body.innerHTML = buildElement(this.style);
      document.querySelector("div").offsetWidth = 101;

      var width = DOMUtils.getComputedWidth(document.querySelector("div"));
      expect(width).toEqual(100);
    });

    it("calculates computed width", function () {
      this.style.push(
        "padding-left: 1px",
        "padding-right: 1px",
        "border-left-width: 1px",
        "border-right-width: 1px"
      );
      document.body.innerHTML = buildElement(this.style);
      document.querySelector("div").offsetWidth = 104;

      var width = DOMUtils.getComputedWidth(document.querySelector("div"));
      expect(width).toEqual(100);
    });

    it("does not calculate unnecessary properties", function () {
      this.style.push(
        "padding-top: 1px",
        "padding-bottom: 1px",
        "border-top-width: 1px",
        "border-bottom-width: 1px"
      );
      document.body.innerHTML = buildElement(this.style);
      document.querySelector("div").offsetWidth = 100;

      var width = DOMUtils.getComputedWidth(document.querySelector("div"));
      expect(width).toEqual(100);
    });

  });

});