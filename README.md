# Capstone Module

This module provides thin bindings for the Capstone disassembly framework.

```bash
soon..
```

## Example

```javascript
import cs from "./path/to/wrapper.js";

const arch = cs.ARCH_ARM64; // or cs.ARCH_AARCH64
const mode = cs.MODE_ARCH;

// prettier-ignore
const code = [
  0x00, 0x00, 0x80, 0xd2, // 0x1000: movz x0, #0
  0xfd, 0xfb, 0xff, 0x17, // 0x1004: b #0xfffffffffffffff8
  0x88, 0x02, 0x40, 0xb9, // 0x1008: ldr w8, [x20]
  0x20, 0x00, 0x02, 0x8b, // 0x100c: add x0, x1, x2
  0x20, 0x00, 0x00, 0xf9, // 0x1010: str x0, [x1]
  0x20, 0x00, 0x42, 0xf8, // 0x1014: ldur x0, [x1, #0x20]
  0x20, 0x88, 0x82, 0x4f, // 0x1018: mul v0.4s, v1.4s, v2.s[2]
];
const disassembler = new cs.Capstone(arch, mode);

const instructions = disassembler.disasm(code, 0x1000 /* optional length */);
for (const insn of instructions)
  console.log(
    `0x${insn.address.toString(16)}\t${insn.mnemonic}\t${insn.op_str}`,
  );
/*
the instruction array will look kinda like this
[
  {
    id: 191,
    address: 4096, // 0x1000
    size: 4,
    mnemonic: "movz",
    op_str: "x0, #0",
    bytes: [ 0, 0, 128, 210 ]
  },
  // The rest will be in this same format
  ...
]
*/

// if you want to iterate one at a time you can use the disasm_iter method
const data = {
  // the input will have to be an object because primitive values are read only
  buffer: armBuffer,
  addr: 0x1000,
  insn: {}, // or null, this will be filled once you call disasm_iter
};

// this returns a boolean, which will become false either when it is done iterating,
// or if it comes upon an invalid instruction
while (disassembler.disasm_iter(data)) {
  // every iteration this function goes through, it will edit the data object with the new instruction.
  // also if the current instruction is valid and there are still instructions to go through,
  // the data object will be updated with the next iterations bytes and address, so after the first loop,
  // the buffer will be changed to the next set of bytes and the address will be iterated as well
  const insn = data.insn;
  console.log(
    `0x${insn.address.toString(16)}\t${insn.mnemonic}\t${insn.op_str}`,
  );
}

// options

// OPT_MNEMONIC
const mnObj = {
  id: 191, // the id returned in the insn object, in this case, its movz, you can also find more in the constants file
  name: "foo", // the new name of the mnemonic
};
disassembler.option(cs.OPT_MNEMONIC, mnObj);
// now every time disasm (or disasm_iter) comes across
// a movz instruction in the span of your disassembler instance,
// movz will be aliased to foo, the id will still remain the same as movz

// OPT_MODE
disassembler.option(cs.OPT_MODE, cs.MODE_LITTLE_ENDIAN);
// after using this, your disassembler mode will be MODE_LITTLE_ENDIAN until the instance is closed or changed again

// OPT_SYNTAX
disassembler.option(cs.OPT_SYNTAX, OPT_SYNTAX_INTEL); // Default assembly syntax of all platforms (CS_OPT_SYNTAX)

// OPT_SKIPDATA
disassembler.option(cs.OPT_SKIPDATA, true /* true/false/OPT_ON/OPT_OFF */);
// When disassembling binary code, there are often sections that contain
// non-executable data, such as ASCII strings, data structures, or other
// non-instruction bytes. By using CS_OPT_SKIPDATA, you can instruct
// Capstone to skip over these non-instruction bytes and only disassemble the actual instructions.

// NOT IMPLEMENTED
// OPT_SKIPDATA_SETUP, OPT_UNSIGNED, OPT_MEM, OPT_DETAIL

// support
cs.support(cs.MODE_LITTLE_ENDIAN);
// this will return a boolean, true if valid
// and false if not, in this case it will return true

// version
cs.version();
// this should be 4.0, eventually I will use 5.0

// reg_name
disassembler.reg_name(183); // should return w15
// currently because OPT_DETAIL isn't implemented
// you cannot get these ids unless you look at the constants
// or you use another binding

// insn_name
disassembler.insn_name(191); // movz
// this returns the name of the mnemonic corresponding to the id
// the id can be found either from the constants file or from disassembly results

// close
disassembler.close();
// this closes the Capstone instance, because we are binding c to JS
// we now have to free unused pointers, JS usually has garbage collection
// but C does not, so we have to free the disassembler instance from memory
// manually after it's no longer in use
```

you can also take a look at the [tests](src/tests)

## Constants

if you would like to see all the options and capstone constants, you can find
them in either the [wrapper.ts](src/wrapper.ts) file or the [constants.ts](src/constants.ts) file
things like register ids, options, error codes, groups ect

## TODO

- [ ] implement all the options
- [ ] add support for small helper functions
- [ ] make this an npm package
- [ ] add better tests

## Documentation

For detailed documentation on available constants and methods, refer to the source code comments and the Capstone website:

- [Function Reference](https://code.dlang.org/packages/d-capstone) for constants and function documentation
- [Capstone Website](https://www.capstone-engine.org/iteration.html) capstone website
- [Source](https://github.com/capstone-engine/capstone) source code for capstone

## Credits

- [capstone](https://github.com/capstone-engine/capstone)
- [emscripten](https://emscripten.org/docs/getting_started/downloads.html#sdk-download-and-install)

## Contributing

Contributions to the Capstone module are welcome. If you would like to contribute, please follow these guidelines:

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bug fix: `git checkout -b my-feature`.
3. Make your changes and test them thoroughly.
4. Commit your changes with a clear and descriptive commit message: `git commit -am 'Add new feature'`.
5. Push your branch to your fork: `git push origin my-feature`.
6. Create a pull request against the main repository's `main` branch.

Before submitting a pull request, ensure that:

- Your code follows the existing style and conventions ( in some cases this doesnt matter )
- You have added appropriate documentation for your changes.
- All existing tests pass, and you have added new tests for any new functionality.
- The fix or added function acts as it does in the official capstone

Once your pull request is submitted, it will be reviewed by me. Thank you

## Editing Documentation

If you want to edit the documentation for the Capstone module, please follow these guidelines:

1. **Accuracy**: Ensure that any changes made to the documentation accurately reflect the functionality or behavior of the module.
2. **Clarity**: Use clear and concise language to explain concepts, methods, and usage examples. Avoid jargon or overly technical language that may be difficult for users to understand.
3. **Consistency**: Maintain consistency in formatting, style, and terminology throughout the documentation. Follow the existing patterns and conventions to ensure coherence.
4. **Completeness**: Make sure that the documentation covers all relevant aspects of the module, including available constants, methods, and usage instructions. If you add new features or options, update the documentation accordingly.
5. **Examples**: Include code examples wherever possible to illustrate usage patterns and demonstrate how to use the module effectively. Ensure that examples are relevant, accurate, and easy to follow.
6. **Documentation Comments**: If you're editing source code comments, ensure they are informative, clear, and follow the appropriate formatting conventions.
7. **Review**: Before submitting your changes, review the documentation to check for any errors, typos, or inconsistencies. It's helpful to have someone else review your changes as well to ensure quality.
8. **Versioning**: If your changes are specific to a particular version of the module, indicate this clearly in the documentation. If applicable, provide information about backward compatibility or deprecated features.
9. **Documentation Structure**: If you're making structural changes to the documentation, ensure that the organization and layout remain logical and intuitive for users to navigate.
10. **Commit Messages**: Use clear and descriptive commit messages when committing your changes. This helps maintain a clear history of changes and makes it easier to track modifications over time.

## Issues

If you encounter any bugs, have questions, or want to suggest new features for the Capstone wrapper, please open an issue on the GitHub repository.

Before opening a new issue, please ensure that:

- You have searched existing issues to see if the problem or suggestion has already been reported.
- You provide detailed information about the problem or suggestion, including steps to reproduce for bugs.
- Make sure this isnt something to do with your JavaScript runtime

When opening a new issue, please use a clear and descriptive title and provide as much context as possible to help understand the issue or suggestion.

Thank you for your contribution!

## notes

- idk why i did all this, i dont expect any contribution
