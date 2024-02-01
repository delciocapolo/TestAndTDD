# My notes

### Topic about some functions, like:
1. mock -- Mock functions allow you to test the links between code by erasing the actual implementation of a function, capturing calls to the function (and the parameters passed in those calls), capturing instances of constructor functions when instantiated with new, and allowing test-time configuration of return values. These mock members are very useful in tests to assert how these functions get called, instantiated, or what they returned:

### Installing the need modules, by order:
1. <code>npm install --save-dev typescript ts-node-dev @types/node prisma</code>
2. <code>npm install @prisma/client</code>
3. <code>npm install --save-dev ts-jest jest</code>
4. We can choose to install API's Jest, using <code>npm install --save-dev @jest/globals</code> where we will need import all API or we can <code>npm install --save-dev @types/jest</code>, it provides types for Jest globals without needing to import them.

### Creating Jest config file
> By default, Jest can run without any config files, but it will not compile .ts files. To make it transpile TypeScript with ts-jest, we will need to create a configuration file that will tell Jest to use a ts-jest preset.
