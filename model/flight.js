class Flight {
    constructor(
      flightCode = null, type = null, marketingAirline = null, operatingAirline = null, aircraftIata = null, aircraftIcao = null, aircraftName = null,
      departTerminal = null, arrivalTerminal = null, departDateTime = null, arrivalDateTime = null, transitAirport = null, transitFlightCode = null,
      transitMarketingAirline = null, transitOperatingAirline = null, transitDepartTerminal = null, transitArrivalTerminal = null,
      transitArrivalDateTime = null, transitDepartDateTime = null, cabinClass = null, bookingClass = null, classType = null,
      freeCabinBaggageWeight = null, freeCabinBaggageUnit = null, freeBaggageWeight = null, freeBaggageUnit = null, freeBaggageQty = null,
      refundable = null, hasMeal = null, hasEntertainment = null, currency = null, priceAdult = null, taxAdult = null, otherAdult = null,
      priceChild = null, taxChild = null, otherChild = null, priceInfant = null, taxInfant = null, otherInfant = null
    ) {
      this.flightCode = flightCode;
      this.type = type;
      this.marketingAirline = marketingAirline;
      this.operatingAirline = operatingAirline;
      this.aircraftIata = aircraftIata;
      this.aircraftIcao = aircraftIcao;
      this.aircraftName = aircraftName;
      this.departTerminal = departTerminal;
      this.arrivalTerminal = arrivalTerminal;
      this.departDateTime = departDateTime;
      this.arrivalDateTime = arrivalDateTime;
      this.transitAirport = transitAirport;
      this.transitFlightCode = transitFlightCode;
      this.transitMarketingAirline = transitMarketingAirline;
      this.transitOperatingAirline = transitOperatingAirline;
      this.transitDepartTerminal = transitDepartTerminal;
      this.transitArrivalTerminal = transitArrivalTerminal;
      this.transitArrivalDateTime = transitArrivalDateTime;
      this.transitDepartDateTime = transitDepartDateTime;
      this.cabinClass = cabinClass;
      this.bookingClass = bookingClass;
      this.classType = classType;
      this.freeCabinBaggageWeight = freeCabinBaggageWeight;
      this.freeCabinBaggageUnit = freeCabinBaggageUnit;
      this.freeBaggageWeight = freeBaggageWeight;
      this.freeBaggageUnit = freeBaggageUnit;
      this.freeBaggageQty = freeBaggageQty;
      this.refundable = refundable;
      this.hasMeal = hasMeal;
      this.hasEntertainment = hasEntertainment;
      this.currency = currency;
      this.priceAdult = priceAdult;
      this.taxAdult = taxAdult;
      this.otherAdult = otherAdult;
      this.priceChild = priceChild;
      this.taxChild = taxChild;
      this.otherChild = otherChild;
      this.priceInfant = priceInfant;
      this.taxInfant = taxInfant;
      this.otherInfant = otherInfant;
    }
    // Getters and setters
    get flightCode() {
        return this._flightCode;
    }
    set flightCode(value) {
        this._flightCode = value;
    }

    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }

    get marketingAirline() {
        return this._marketingAirline;
    }
    set marketingAirline(value) {
        this._marketingAirline = value
    }
    get operatingAirline() {
        return this._operatingAirline;
    }
    set operatingAirline(value) {
        this._operatingAirline = value;
    }

    get aircraftIata() {
        return this._aircraftIata;
    }
    set aircraftIata(value) {
        this._aircraftIata = value;
    }

    get aircraftIcao() {
        return this._aircraftIcao;
    }
    set aircraftIcao(value) {
        this._aircraftIcao = value;
    }

    get aircraftName() {
        return this._aircraftName;
    }
    set aircraftName(value) {
        this._aircraftName = value;
    }

    get departTerminal() {
        return this._departTerminal;
    }
    set departTerminal(value) {
        this._departTerminal = value;
    }

    get arrivalTerminal() {
        return this._arrivalTerminal;
    }
    set arrivalTerminal(value) {
        this._arrivalTerminal = value;
    }

    get departDateTime() {
        return this._departDateTime;
    }
    set departDateTime(value) {
        this._departDateTime = value;
    }

    get arrivalDateTime() {
        return this._arrivalDateTime;
    }
    set arrivalDateTime(value) {
        this._arrivalDateTime = value;
    }
    // Getters and setters (continued)
    get transitAirport() {
        return this._transitAirport;
    }
    set transitAirport(value) {
        this._transitAirport = value;
    }

    get transitFlightCode() {
        return this._transitFlightCode;
    }
    set transitFlightCode(value) {
        this._transitFlightCode = value;
    }

    get transitMarketingAirline() {
        return this._transitMarketingAirline;
    }
    set transitMarketingAirline(value) {
        this._transitMarketingAirline = value;
    }

    get transitOperatingAirline() {
        return this._transitOperatingAirline;
    }
    set transitOperatingAirline(value) {
        this._transitOperatingAirline = value;
    }

    get transitDepartTerminal() {
        return this._transitDepartTerminal;
    }
    set transitDepartTerminal(value) {
        this._transitDepartTerminal = value;
    }

    get transitArrivalTerminal() {
        return this._transitArrivalTerminal;
    }
    set transitArrivalTerminal(value) {
        this._transitArrivalTerminal = value;
    }

    get transitArrivalDateTime() {
        return this._transitArrivalDateTime;
    }
    set transitArrivalDateTime(value) {
        this._transitArrivalDateTime = value;
    }

    get transitDepartDateTime() {
        return this._transitDepartDateTime;
    }
    set transitDepartDateTime(value) {
        this._transitDepartDateTime = value;
    }

    get cabinClass() {
        return this._cabinClass;
    }
    set cabinClass(value) {
        this._cabinClass = value;
    }

    get bookingClass() {
        return this._bookingClass;
    }
    set bookingClass(value) {
        this._bookingClass = value;
    }

    get classType() {
        return this._class;
    }
    set classType(value) {
        this._class = value;
    }

    get freeCabinBaggageWeight() {
        return this._freeCabinBaggageWeight;
    }
    set freeCabinBaggageWeight(value) {
        this._freeCabinBaggageWeight = value;
    }

    get freeCabinBaggageUnit() {
        return this._freeCabinBaggageUnit;
    }
    set freeCabinBaggageUnit(value) {
        this._freeCabinBaggageUnit = value;
    }

    get freeBaggageWeight() {
        return this._freeBaggageWeight;
    }
    set freeBaggageWeight(value) {
        this._freeBaggageWeight = value;
    }

    get freeBaggageUnit() {
        return this._freeBaggageUnit;
    }
    set freeBaggageUnit(value) {
        this._freeBaggageUnit = value;
    }

    get freeBaggageQty() {
        return this._freeBaggageQty;
    }
    set freeBaggageQty(value) {
        this._freeBaggageQty = value;
    }

    get refundable() {
        return this._refundable;
    }
    set refundable(value) {
        this._refundable = value;
    }

    get hasMeal() {
        return this._hasMeal;
    }
    set hasMeal(value) {
        this._hasMeal = value;
    }

    get hasEntertainment() {
        return this._hasEntertainment;
    }
    set hasEntertainment(value) {
        this._hasEntertainment = value;
    }

    // Getters and setters (continued)
    get currency() {
        return this._currency;
    }
    set currency(value) {
        this._currency = value;
    }

    get priceAdult() {
        return this._priceAdult;
    }
    set priceAdult(value) {
        this._priceAdult = value;
    }

    get taxAdult() {
        return this._taxAdult;
    }
    set taxAdult(value) {
        this._taxAdult = value;
    }

    get otherAdult() {
        return this._otherAdult;
    }
    set otherAdult(value) {
        this._otherAdult = value;
    }

    get priceChild() {
        return this._priceChild;
    }
    set priceChild(value) {
        this._priceChild = value;
    }

    get taxChild() {
        return this._taxChild;
    }
    set taxChild(value) {
        this._taxChild = value;
    }

    get otherChild() {
        return this._otherChild;
    }
    set otherChild(value) {
        this._otherChild = value;
    }

    get priceInfant() {
        return this._priceInfant;
    }
    set priceInfant(value) {
        this._priceInfant = value;
    }

    get taxInfant() {
        return this._taxInfant;
    }
    set taxInfant(value) {
        this._taxInfant = value;
    }

    get otherInfant() {
        return this._otherInfant;
    }
    set otherInfant(value) {
        this._otherInfant = value;
    }
}
module.exports = Flight;