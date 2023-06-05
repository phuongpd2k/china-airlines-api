class BookingClass {
    constructor(
      ffCode = null,cabinClass = null
    ) {
      this.ffCode = ffCode;
      this.cabinClass = cabinClass;
    }
    // Getters and setters

    get ffCode() {
        return this._ffCode;
    }
    set ffCode(value) {
        this._ffCode = value;
    }

    get cabinClass() {
        return this._cabinClass;
    }
    set cabinClass(value) {
        this._cabinClass = value;
    }
}
module.exports = BookingClass;