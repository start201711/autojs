module.exports = function () {
    let _ra = device.sdkInt < 24 ? new RootAutomator() : null;
    this.press = function (x, y) {
        if (_ra) {
            _ra.press(x, y, 100);
            return true;
        } else {
            return press(x, y, 100);
        }
    };
    this.pressCenter = function (o) {
        return this.press(o.bounds().centerX(), o.bounds().centerY());
    }
};