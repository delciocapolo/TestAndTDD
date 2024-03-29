import { PrismaClient } from "@prisma/client";
import { debuglog, DebugLogger } from "node:util";
import {
  IProvider,
  IBuyer,
  ICar,
  ISoldCar,
  IPromoteCar,
} from "./interfaces.module";
import { generateHash } from "../util/encrypt";

class Stand {
  public prisma: PrismaClient;
  private log: DebugLogger;

  constructor() {
    this.prisma = new PrismaClient();
    this.log = debuglog("database-stand");
  }

  async createProvider(dataProvider: IProvider) {
    const { email } = dataProvider;
    const providerExists = await this.prisma["provider"].findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (providerExists) {
      return { message: `Provider already exists`, status: false };
    }

    const { name, password } = dataProvider;
    const provider = await this.prisma["provider"].create({
      data: {
        name,
        email,
        password: generateHash(password),
      },
    });

    return provider;
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
      return { message: "The Provider don't exists", status: false };
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
      return { message: "Car don't exists", status: false };
    }

    const { sold, sale: saleCar, numberPlate } = car;

    if (sold) {
      return { message: "The car was sold", status: false };
    }

    if (saled === true && saleCar === false) {
      return {
        message: "The is not on sale, so the buyer should not be discounted",
        status: false,
      };
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
      return { message: "The Car don't exists!", status: false };
    }

    const { sale: alreadyInsale } = availableCar;

    if (alreadyInsale) {
      return { message: "The car already is in sale!", status: false };
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
      return { message: `This ${tbl_verified} don't exists!`, status: false };
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

  async getProviders(email?: string) {
    let providers;

    if (email) {
      providers = await this.prisma["provider"].findUnique({
        where: {
          email,
        },
        select: {
          name: true,
          email: true,
          createdAt: true,
        },
      });

      if (providers === null) {
        return { message: "provider not found", status: false };
      }
      return providers;
    }

    providers = await this.prisma["provider"].findMany({
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return providers;
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
