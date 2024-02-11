# My notes

### Topic about some functions, like:
1. mock -- Mock functions allow you to test the links between code by erasing the actual implementation of a function, capturing calls to the function (and the parameters passed in those calls), capturing instances of constructor functions when instantiated with new, and allowing test-time configuration of return values. These mock members are very useful in tests to assert how these functions get called, instantiated. Read more at:  [mock-functions](https://jestjs.io/docs/mock-functions)

### Installing the need modules, by order:
1. <code>npm install --save-dev typescript ts-node-dev @types/node prisma</code>
2. <code>npm install @prisma/client</code>
3. <code>npm install --save-dev ts-jest jest</code>
4. We can choose to install API's Jest, using <code>npm install --save-dev @jest/globals</code> where we will need import all API or we can <code>npm install --save-dev @types/jest</code>, it provides types for Jest globals without needing to import them.

### Creating Jest config file
> By default, Jest can run without any config files, but it will not compile .ts files. To make it transpile TypeScript with ts-jest, we will need to create a configuration file that will tell Jest to use a ts-jest preset.
ts-jest can create the configuration file for you automatically: <br> 
<code>npx ts-jest config:init</code>

### Creatign database using Prisma, using SQLite
1. npx prisma init --datasource-provider sqlite
1.1 This creates a new prisma directory with your Prisma schema file and configures SQLite as your database.
2. npx prisma format -- *optional*
3. npx prisma generate
4. npx prisma db push

## Links:
1. Installing Jest, ts-jest: <br>
1.1 [Getting started](https://jestjs.io/pt-BR/docs/getting-started) <br>
1.2 [ts-jest](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/)
2. Installing prisma: [Prisma Set up](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql)
3. [TDD](https://www.treinaweb.com.br/blog/afinal-o-que-e-tdd)
4. [Debug Log](https://nodejs.org/api/util.html#debuglogenabled)
