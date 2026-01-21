// utils/phone.js
import { parsePhoneNumberFromString } from "libphonenumber-js";

// List of countries where local numbers start with 0
const zeroCountries = ["BD"]; // Add more if needed, e.g., "IN", "GB"

export const splitPhoneNumber = (input) => {
  if (!input || typeof input !== "string") {
    return { error: "Invalid input" };
  }

  input = input.trim();

  const phoneNumber = parsePhoneNumberFromString(input);

  if (phoneNumber && phoneNumber.isValid()) {
    let mainNumber = phoneNumber.nationalNumber;

    // Add leading 0 for specific countries if input has local format or +country
    if (
      (input.startsWith("0") || input.startsWith("+" + phoneNumber.countryCallingCode)) &&
      zeroCountries.includes(phoneNumber.country)
    ) {
      mainNumber = "0" + mainNumber;
    }

    return {
      countryCode: phoneNumber.countryCallingCode,
      mainNumber,
      fullPhone: phoneNumber.format("E.164"),
      error: null,
    };
  } else {
    // No country code, just main number
    const mainNumber = input.replace(/\D/g, "");
    return {
      countryCode: null,
      mainNumber,
      fullPhone: mainNumber,
      error: null,
    };
  }
};
