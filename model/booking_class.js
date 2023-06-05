class BookingClass {
    constructor(
      ffCode = null,cabinClass = null, classType = null
    ) {
      this.ffCode = ffCode;
      this.cabinClass = cabinClass;
      this.classType = classType;
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

    get classType() {
        return this.classType;
    }
    set classType(value) {
        this._classType = value;
    }
}
module.exports = BookingClass;