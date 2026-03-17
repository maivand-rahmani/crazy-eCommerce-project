const ZIP_REGEX = /^[A-Za-z0-9 -]{3,12}$/;
const PHONE_REGEX = /^[+\d()\-\s]{7,20}$/;

function normalizeText(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function ensureLength(value, label, { min = 1, max = 120 } = {}) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length < min) {
    throw new Error(`${label} is required.`);
  }

  if (normalizedValue.length > max) {
    throw new Error(`${label} must be ${max} characters or fewer.`);
  }

  return normalizedValue;
}

export function normalizeAddressInput(input = {}, options = {}) {
  const nowIsoString = options.nowIsoString || new Date().toISOString();
  const existingId = normalizeText(input.id) || options.id || crypto.randomUUID();
  const street = ensureLength(input.street, "Street address", { min: 5, max: 140 });
  const city = ensureLength(input.city, "City", { min: 2, max: 80 });
  const state = ensureLength(input.state, "State", { min: 2, max: 80 });
  const zip = ensureLength(input.zip, "ZIP code", { min: 3, max: 12 });
  const country = ensureLength(input.country, "Country", { min: 2, max: 80 });
  const phone = ensureLength(input.phone, "Phone number", { min: 7, max: 20 });

  if (!ZIP_REGEX.test(zip)) {
    throw new Error("Enter a valid ZIP or postal code.");
  }

  if (!PHONE_REGEX.test(phone)) {
    throw new Error("Enter a valid phone number.");
  }

  return {
    id: existingId,
    version: 1,
    street,
    city,
    state,
    zip: zip.toUpperCase(),
    country,
    phone,
    isDefault: Boolean(input.isDefault),
    createdAt: input.createdAt || nowIsoString,
    updatedAt: nowIsoString,
  };
}

export function getAddressSignature(address) {
  if (!address) return "";

  return [
    address.street,
    address.city,
    address.state,
    address.zip,
    address.country,
    address.phone,
  ]
    .map((part) => normalizeText(part).toLowerCase())
    .join("|");
}

export function normalizeAddressCollection(addresses = [], options = {}) {
  const nowIsoString = options.nowIsoString || new Date().toISOString();
  const normalizedAddresses = addresses.map((address) =>
    normalizeAddressInput(address, {
      id: address?.id,
      nowIsoString,
    }),
  );

  const seenSignatures = new Set();

  for (const address of normalizedAddresses) {
    const signature = getAddressSignature(address);

    if (seenSignatures.has(signature)) {
      throw new Error("This address is already saved.");
    }

    seenSignatures.add(signature);
  }

  let defaultAssigned = false;
  const addressesWithSingleDefault = normalizedAddresses.map((address, index) => {
    if (address.isDefault && !defaultAssigned) {
      defaultAssigned = true;
      return address;
    }

    if (address.isDefault) {
      return {
        ...address,
        isDefault: false,
      };
    }

    if (!defaultAssigned && index === 0) {
      defaultAssigned = true;
      return {
        ...address,
        isDefault: true,
      };
    }

    return address;
  });

  return addressesWithSingleDefault;
}
