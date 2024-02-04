import { PrismaClient } from "@prisma/client";
import { debuglog, DebugLogger } from "node:util";
import {
  IProvider,
  IBuyer,
  ICar,
  ISoldCar,
  IPromoteCar,
} from "./interfaces.module";

class Stand {
  public prisma: PrismaClient;
  private log: DebugLogger;

  constructor() {
    this.prisma = new PrismaClient();
    this.log = debuglog("database-stand", (debug) => {
      debug("DISPLAY THE LOGS");
    });
  }

  async createProvider({ name, email, adressBank }: IProvider) {
    const providerExists = await this.prisma["provider"].findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        email: true,
        createdAt: true,
        adressBank: false,
      },
    });

    if (providerExists) {
      this.log("Provider already exists!\n");
      return providerExists;
    }

    const data: IProvider = {
      name,
      email,
      adressBank,
    };
    const provider = await this.prisma["provider"].create({
      data,
    });

    return { ...provider, adressBank: "secret" };
  }

  async createCar({
    name,
    model,
    releaseAt = new Date().getFullYear().toString(),
    price,
    description,
    providerId,
  }: ICar) {
    const provider = await this.prisma["provider"].findUnique({
      where: {
        id: providerId,
      },
    });

    if (provider === null) {
      throw new Error("The Provider don't exists!");
    }

    const { id } = provider!;

    const car = await this.prisma["car"].create({
      data: {
        name,
        model,
        releaseAt,
        price,
        description,
        providers: {
          connect: {
            id,
          },
        },
      },
    });

    return car;
  }

  async createBuyer({
    name,
    email,
    saled = false,
    countCar = 1,
    carId,
  }: IBuyer) {
    // by renaming sale to saleCar
    const car = await this.prisma["car"].findUnique({
      where: {
        numberPlate: carId,
      },
    });

    if (car === null) {
      throw new Error("Car don't exists!");
    }

    const { sold, sale: saleCar, numberPlate } = car;

    if (sold) {
      throw new Error("The car was sold!");
    }

    if (saled === true && saleCar === false) {
      throw new Error(
        "The is not on sale, so the buyer should not be discounted!"
      );
    }

    const buyerExists = await this.prisma["buyer"].findUnique({
      where: {
        email,
      },
    });

    if (buyerExists) {
      const { id: buyerId } = buyerExists;
      const sellCar = await this.sellCar({
        buyerId,
        carId,
      });

      return sellCar;
    }

    const buyer = await this.prisma["buyer"].create({
      data: {
        name,
        email,
        countCar,
        saled,
        cars: {
          connect: {
            numberPlate,
          },
        },
      },
    });

    return buyer;
  }

  async promoteCar({ sale = true, discountAmount, numberPlate }: IPromoteCar) {
    // check if car exists
    const availableCar = await this.prisma["car"].findUnique({
      where: {
        numberPlate,
      },
    });

    if (availableCar === null) {
      throw new Error("The Car don't exists!");
    }

    const { sale: alreadyInsale } = availableCar;

    if (alreadyInsale) {
      throw new Error("The car already is in sale!");
    }

    const updatedCar = await this.prisma["car"].update({
      data: {
        sale,
        discountAmount,
      },
      where: {
        numberPlate,
      },
    });

    return updatedCar;
  }

  async sellCar({ carId, buyerId }: ISoldCar) {
    const car = await this.prisma["car"].findUnique({
      where: {
        numberPlate: carId,
      },
    });
    const buyer = await this.prisma["buyer"].findUnique({
      where: {
        id: buyerId,
      },
    });

    if (car === null || buyer === null) {
      const tbl_verified = car === null ? car : buyer;

      throw new Error(`This ${tbl_verified} don't exists!`);
    }

    const sellCar = await this.prisma["soldCar"].create({
      data: {
        buyerId,
        carId,
      },
    });

    const soldCar = await this.prisma["car"].update({
      data: {
        sold: true,
        sale: false,
      },
      where: {
        numberPlate: carId,
      },
    });

    return { sellCar, soldCar };
  }

  async getAllProviders() {
    const allProviders = await this.prisma["provider"].findMany({
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return allProviders;
  }

  async getAllProviderWithCars() {
    const all = await this.prisma["provider"].findMany({
      select: {
        name: true,
        email: true,
        createdAt: true,
        cars: {
          select: {
            _count: true,
            name: true,
            model: true,
            description: true,
            price: true,
            releaseAt: true,
            sale: true,
            discountAmount: true,
            sold: true,
            createdAt: true,
            soldCars: {
              select: {
                buyers: {
                  select: {
                    name: true,
                    email: true,
                    saled: true,
                    countCar: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return all;
  }

  async getAllCars() {
    const allCars = await this.prisma["car"].findMany({
      select: {
        name: true,
        model: true,
        description: true,
        releaseAt: true,
        price: true,
        sale: true,
        discountAmount: true,
        sold: true,
        createdAt: true,
      },
    });

    return allCars;
  }
}

export default new Stand();
