import { environment } from '../../../../../environments/environment';

class HelperFn {
  setDisplayAddressLine(addressLine1, addressLine2, addressLine3, postalCode) {
    // console.log(addressLine1, addressLine2, addressLine3, postalCode)
    const address1 = !this.isEmptyOrNullOrUndefined(addressLine1) ? addressLine1 + ', ' : '';
    const address2 = !this.isEmptyOrNullOrUndefined(addressLine2) ? addressLine2 + ', ' : '';
    const address3 = !this.isEmptyOrNullOrUndefined(addressLine3) ? addressLine3 + ', ' : '';
    const postal = !this.isEmptyOrNullOrUndefined(postalCode) ? postalCode : '';

    return address1 + address2 + address3 + postal;
  }

  setStateCountryLine(stateCode, countryCode) {
    const countryCodeToName = environment.countryCodeToName;
    const stateCodeToName = environment.countryCodeToStates[countryCode];
    const state = !this.isEmptyOrNullOrUndefined(stateCode) ? stateCodeToName[stateCode] + ', ' : '';
    const country = !this.isEmptyOrNullOrUndefined(countryCode) ? countryCodeToName[countryCode] : '';

    return state + country;
  }

  isEmptyOrNullOrUndefined(str: string) {
    return (str === "" || str === null || str === "null" || str === undefined || str === "undefined");
  }
}

export default HelperFn;
