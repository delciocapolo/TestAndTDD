import { describe, it, expect } from "@jest/globals";
import { debuglog } from "util";
import StandModule from "../src/stand/Stand.module";

const log = debuglog("test");

function displayData(datas: any) {
  const dataProviderReturned = JSON.stringify(datas, null, 2);
  log(`${dataProviderReturned}\n`);
}

describe("Sign up provider and car", () => {
  it("should it return datas of the provider registred in database", async () => {
    const provider = await StandModule.createProvider({
      name: "Delcio Capolo",
      email: "delcioextens2022@gmail.com",
      adressBank: "0938373-227722-9282733-29393",
    });

    displayData(provider);

    expect(provider).toBeDefined();
  });

  it("should it return datas of the car registred in database", async () => {
    const car = await StandModule.createCar({
      name: "Toyota Land Cruiser",
      model: "Toyota Land Cruiser 2021",
      price: 17673000.32,
      description: "used",
      releaseAt: "2021",
      providerId: 1,
    });

    displayData(car);

    expect(car).toBeDefined();
  });
});

describe("Get all providers and car", () => {
  it("should it return all providers", async () => {
    const allProviders = await StandModule.getAllProviders();
    displayData(allProviders);
  });

  it("should it return all cars", async () => {
    const allCars = await StandModule.getAllCars();
    displayData(allCars);
  });

  it("should it return all providers with yours cars", async () => {
    const all = await StandModule.getAllProviderWithCars();
    displayData(all);
  });
});

describe("Promote car and sell car", () => {
  it("should it change the status of the promote", async () => {
    const promoteStatus = await StandModule.promoteCar({
      sale: true,
      discountAmount: 20,
      numberPlate: "cls7pilft0000hea056w1z0vq",
    });
    displayData(promoteStatus);
  });
});
