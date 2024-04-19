import Module from './capstone';
import { Memory } from './memory';

const Wrapper: wasm_module = Module() as wasm_module;

type cs_err = number; // All type of errors encountered by Capstone API. These are values returned by cs_errno()
type cs_arch = number; // Architecture type
type cs_mode = number; // Mode type
type cs_opt_type = number; // Runtime option for the disassembled engine
type cs_opt_value = number; // Runtime option value (associated with option type above)
type cs_group_type = number; // Common instruction groups - to be consistent across all architectures.
type cs_op_type = number; // Common instruction operand types - to be consistent across all architectures
type cs_ac_type = number; // Common instruction operand access types - to be consistent across all architectures. It is possible to combine access types, for example: CS_AC_READ | CS_AC_WRITE
type cs_regs = Array<number>; // Type of array to keep the list of registers
type csh = number; // Handle using with all API
type ptr = number; // Points to a specific memory address
type wasm_arg = 'number' | 'string' | 'array' | 'boolean' | 'pointer' | null; // types of arguments for the C function.
type wasm_t = 'i8' | 'i16' | 'i32' | 'i64' | 'float' | 'double' | 'i8*' | '*'; // An LLVM IR type as a string

// Module object with attributes that Emscripten-generated code calls at various points in its execution.
interface wasm_module {
  HEAP8: Int8Array; // View for 8-bit signed memory.
  HEAPU8: Uint8Array; // View for 8-bit unsigned memory.
  HEAP16: Int16Array; // View for 16-bit signed memory.
  HEAPU16: Uint16Array; // View for 16-bit unsigned memory.
  HEAP32: Int32Array; // View for 32-bit signed memory.
  HEAPU32: Uint32Array; // View for 32-bit unsigned memory.
  HEAPF32: Float32Array; // View for 32-bit float memory.
  HEAPF64: Float64Array; // View for 8-bit float memory.
  _cs_free: (insn: ptr, count: number) => void; // Free memory allocated by _cs_malloc() or disasm()
  _cs_malloc: (handle: csh) => ptr; // Allocate memory for 1 instruction to be used by disasm_iter()
  _malloc: (size: number) => ptr; // Allocates a block of memory on the heap, must be paired with free(), or heap memory will leak! (use Memory.malloc()).
  _free: (pointer: ptr) => void; // Free allocated memory (use Memory.free()).
  ccall: (
    ident: string, // name of C function
    returnType: wasm_arg, // return type
    argTypes: Array<wasm_arg>, // argument types
    args: Array<any>, // arguments
    opts?: {
      async: boolean; // If true, implies that the ccall will perform an async operation. This assumes you are build with asyncify support.
    },
  ) => any; // Call a compiled C function from JavaScript.
  cwrap: (
    ident: string, // name of C function
    returnType: wasm_arg, // return type
    argTypes: Array<wasm_arg>, // argument types
  ) => any; // Returns a native JavaScript wrapper for a C function.
  addFunction: (func: Function, sig: string) => any; // You can use addFunction to return an integer value that represents a function pointer (use Memory.new_callback()).
  setValue: (ptr: number, value: any, type: wasm_t) => void; // Sets a value at a specific memory address at run-time (use Memory.write()).
  getValue: (ptr: number, type: wasm_t) => any; // Gets a value at a specific memory address at run-time (use Memory.read()).
  UTF8ToString: (ptr: number, maxBytesToRead?: number) => string; // Given a pointer ptr to a null-terminated UTF8-encoded string in the Emscripten HEAP, returns a copy of that string as a JavaScript String object.
  stringToNewUTF8: (str: string, outPtr: ptr, maxBytesToWrite: number) => any; // Copies the given JavaScript String object str to the Emscripten HEAP at address outPtr, null-terminated and encoded in UTF8 form.
  writeArrayToMemory: (
    array: Array<number> | Uint8Array | Buffer,
    buffer: ptr,
  ) => void; // Writes an array to a specified address in the heap. Note that memory should to be allocated for the array before it is written.
}

// Detail information of disassembled instruction
interface cs_insn {
  id: number; // Instruction ID (basically a numeric ID for the instruction mnemonic) Find the instruction id in the 'ARCH_insn' enum in the header file of corresponding architecture, such as 'arm_insn' in arm.h for ARM, 'x86_insn' in x86.h for X86, etc... This information is available even when CS_OPT_DETAIL = CS_OPT_OFF NOTE: in Skipdata mode, "data" instruction has 0 for this id field.
  address: number; // Address (EIP) of this instruction This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
  size: number; // Size of this instruction This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
  mnemonic: string; // Ascii text of instruction mnemonic This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
  op_str: string; // Ascii text of instruction operands This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
  bytes: Array<number>; // Machine bytes of this instruction, with number of bytes indicated by @size above This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
  detail?: cs_detail; // cs_detail object
}

// cs_detail object. NOTE: detail object is only valid when both requirements below are met: (1) CS_OP_DETAIL = CS_OPT_ON (2) Engine is not in Skipdata mode (CS_OP_SKIPDATA option set to CS_OPT_ON)
interface cs_detail {
  regs_read: Array<number>; // list of implicit registers read by this insn
  regs_read_count: number; // number of implicit registers read by this insn
  regs_write: Array<number>; // list of implicit registers modified by this insn
  regs_write_count: number; // number of implicit registers modified by this insn
  groups: Array<number>; // list of group this instruction belong to
  groups_count: number; // number of groups this insn belongs to
  writeback: boolean; // Instruction has writeback operands.
  x86?: any; // X86 architecture, including 16-bit, 32-bit & 64-bit mode
  arm?: any; // ARM64 architecture (aka AArch64)
  arm64?: any; // ARM architecture (including Thumb/Thumb2)
  m68k?: any; // M68K architecture
  mips?: any; // MIPS architecture
  ppc?: any; // PowerPC architecture
  sparc?: any; // Sparc architecture
  sysz?: any; // SystemZ architecture
  xcore?: any; // XCore architecture
  tms320c64x?: any; // TMS320C64x architecture
  m680x?: any; // M680X architecture
  evm?: any; // Ethereum architecture
  mos65xx?: any; //MOS65XX architecture (including MOS6502)
  wasm?: any; // Web Assembly architecture
  bpf?: any; // Berkeley Packet Filter architecture (including eBPF)
  riscv?: any; // RISCV architecture
  sh?: any; // SH architecture
  tricore?: any; // TriCore architecture
}

// User-customized setup for SKIPDATA option
interface cs_opt_skipdata {
  mnemonic: string | null; // Capstone considers data to skip as special "instructions", User can specify the string for this instruction's "mnemonic" here (default = ".byte").
  callback: Function | null; // User-defined callback function to be called when Capstone hits data (default = null).
  user_data: object; // User-defined data to be passed to callback function.
}

// Customize mnemonic for instructions with alternative name.
// To reset existing customized instruction to its default mnemonic,
// call option(cs.OPT_MNEMONIC) again with the same id and null value
interface cs_opt_mnem {
  id: number; // ID of instruction to be customized obtained from the cs_insn object.
  mnemonic: string | null; // Customized instruction mnemonic(or null).
}

namespace cs {
  // Return codes
  export const ERR_OK: cs_err = 0; // No error: everything was fine
  export const ERR_MEM: cs_err = 1; // Out-Of-Memory error: cs_open(), cs_disasm(), cs_disasm_iter()
  export const ERR_ARCH: cs_err = 2; // Unsupported architecture: cs_open()
  export const ERR_HANDLE: cs_err = 3; // Invalid handle: cs_op_count(), cs_op_index()
  export const ERR_CSH: cs_err = 4; // Invalid csh argument: cs_close(), cs_errno(), cs_option()
  export const ERR_MODE: cs_err = 5; // Invalid/unsupported mode: cs_open()
  export const ERR_OPTION: cs_err = 6; // Invalid/unsupported option: cs_option()
  export const ERR_DETAIL: cs_err = 7; // Information is unavailable because detail option is OFF
  export const ERR_MEMSETUP: cs_err = 8; // Dynamic memory management uninitialized (see OPT_MEM)
  export const ERR_VERSION: cs_err = 9; // Unsupported version (bindings)
  export const ERR_DIET: cs_err = 10; // Access irrelevant data in "diet" engine
  export const ERR_SKIPDATA: cs_err = 11; // Access irrelevant data for "data" instruction in SKIPDATA mode
  export const ERR_X86_ATT: cs_err = 12; // X86 AT&T syntax is unsupported (opt-out at compile time)
  export const ERR_X86_INTEL: cs_err = 13; // X86 Intel syntax is unsupported (opt-out at compile time)
  export const ERR_X86_MASM: cs_err = 14; // X86 Intel syntax is unsupported (opt-out at compile time)

  // Architectures
  export const ARCH_ARM: cs_arch = 0; // ARM architecture (including Thumb, Thumb-2)
  export const ARCH_ARM64: cs_arch = 1; // ARM-64, also called AArch64
  export const ARCH_AARCH64: cs_arch = 1; // AArch-64, also called ARM-64
  export const ARCH_MIPS: cs_arch = 2; // Mips architecture
  export const ARCH_X86: cs_arch = 3; // X86 architecture (including x86 & x86-64)
  export const ARCH_PPC: cs_arch = 4; // PowerPC architecture
  export const ARCH_SPARC: cs_arch = 5; // Sparc architecture
  export const ARCH_SYSZ: cs_arch = 6; // SystemZ architecture
  export const ARCH_XCORE: cs_arch = 7; // XCore architecture
  export const ARCH_M68K: cs_arch = 8; // 68K architecture
  export const ARCH_TMS320C64X: cs_arch = 9; // TMS320C64x architecture
  export const ARCH_M680X: cs_arch = 10; // 680X architecture;
  export const ARCH_EVM: cs_arch = 11; // Ethereum architecture
  export const ARCH_MOS65XX: cs_arch = 12; // MOS65XX architecture (including MOS6502)
  export const ARCH_WASM: cs_arch = 13; // WebAssembly architecture
  export const ARCH_BPF: cs_arch = 14; // Berkeley Packet Filter architecture (including eBPF)
  export const ARCH_RISCV: cs_arch = 15; // RISCV architecture
  export const ARCH_SH: cs_arch = 16; // SH architecture
  export const ARCH_TRICORE: cs_arch = 17; // TriCore architecture
  export const ARCH_MAX: cs_arch = 18; // The maximum architecture value.
  export const ARCH_ALL: cs_arch = 0xffff; // Represents a mask that includes all architecture values.

  // Modes
  export const MODE_LITTLE_ENDIAN: cs_mode = 0; // little-endian mode (default mode)
  export const MODE_ARM: cs_mode = 0; // 32-bit ARM
  export const MODE_16: cs_mode = 1 << 1; // 16-bit mode (X86)
  export const MODE_32: cs_mode = 1 << 2; // 32-bit mode (X86)
  export const MODE_64: cs_mode = 1 << 3; // 64-bit mode (X86, PPC)
  export const MODE_THUMB: cs_mode = 1 << 4; // ARM's Thumb mode, including Thumb-2
  export const MODE_MCLASS: cs_mode = 1 << 5; // ARM's Cortex-M series
  export const MODE_V8: cs_mode = 1 << 6; // ARMv8 A32 encodings for ARM
  export const MODE_MICRO: cs_mode = 1 << 4; // MicroMips mode (MIPS)
  export const MODE_MIPS3: cs_mode = 1 << 5; // Mips III ISA
  export const MODE_MIPS32R6: cs_mode = 1 << 6; // Mips32r6 ISA
  export const MODE_MIPS2: cs_mode = 1 << 7; // Mips II ISA
  export const MODE_V9: cs_mode = 1 << 4; // SparcV9 mode (Sparc)
  export const MODE_QPX: cs_mode = 1 << 4; // Quad Processing eXtensions mode (PPC)
  export const MODE_SPE: cs_mode = 1 << 5; // Signal Processing Engine mode (PPC)
  export const MODE_BOOKE: cs_mode = 1 << 6; // Book-E mode (PPC)
  export const MODE_PS: cs_mode = 1 << 7; // Paired-singles mode (PPC)
  export const MODE_M68K_000: cs_mode = 1 << 1; // M68K 68000 mode
  export const MODE_M68K_010: cs_mode = 1 << 2; // M68K 68010 mode
  export const MODE_M68K_020: cs_mode = 1 << 3; // M68K 68020 mode
  export const MODE_M68K_030: cs_mode = 1 << 4; // M68K 68030 mode
  export const MODE_M68K_040: cs_mode = 1 << 5; // M68K 68040 mode
  export const MODE_M68K_060: cs_mode = 1 << 6; // M68K 68060 mode
  export const MODE_BIG_ENDIAN: cs_mode = 1 << 31; // big-endian mode
  export const MODE_MIPS32: cs_mode = MODE_32; // Mips32 ISA (Mips)
  export const MODE_MIPS64: cs_mode = MODE_64; // Mips64 ISA (Mips)
  export const MODE_M680X_6301: cs_mode = 1 << 1; // M680X Hitachi 6301,6303 mode
  export const MODE_M680X_6309: cs_mode = 1 << 2; // M680X Hitachi 6309 mode
  export const MODE_M680X_6800: cs_mode = 1 << 3; // M680X Motorola 6800,6802 mode
  export const MODE_M680X_6801: cs_mode = 1 << 4; // M680X Motorola 6801,6803 mode
  export const MODE_M680X_6805: cs_mode = 1 << 5; // M680X Motorola/Freescale 6805 mode
  export const MODE_M680X_6808: cs_mode = 1 << 6; // M680X Motorola/Freescale/NXP 68HC08 mode
  export const MODE_M680X_6809: cs_mode = 1 << 7; // M680X Motorola 6809 mode
  export const MODE_M680X_6811: cs_mode = 1 << 8; // M680X Motorola/Freescale/NXP 68HC11 mode
  export const MODE_M680X_CPU12: cs_mode = 1 << 9; // M680X Motorola/Freescale/NXP CPU12
  export const MODE_M680X_HCS08: cs_mode = 1 << 10; // M680X Freescale/NXP HCS08 mode
  export const MODE_BPF_CLASSIC: cs_mode = 0; // Classic BPF mode (default)
  export const MODE_BPF_EXTENDED: cs_mode = 1 << 0; // Extended BPF mode
  export const MODE_RISCV32: cs_mode = 1 << 0; // RISCV RV32G
  export const MODE_RISCV64: cs_mode = 1 << 1; // RISCV RV64G
  export const MODE_RISCVC: cs_mode = 1 << 2; // RISCV compressed instructure mode
  export const MODE_MOS65XX_6502: cs_mode = 1 << 1; // MOS65XXX MOS 6502
  export const MODE_MOS65XX_65C02: cs_mode = 1 << 2; // MOS65XXX WDC 65c02
  export const MODE_MOS65XX_W65C02: cs_mode = 1 << 3; // MOS65XXX WDC W65c02
  export const MODE_MOS65XX_65816: cs_mode = 1 << 4; // MOS65XXX WDC 65816, 8-bit m/x
  export const MODE_MOS65XX_65816_LONG_M: cs_mode = 1 << 5; // MOS65XXX WDC 65816, 16-bit m, 8-bit x
  export const MODE_MOS65XX_65816_LONG_X: cs_mode = 1 << 6; // MOS65XXX WDC 65816, 8-bit m, 16-bit x
  export const MODE_MOS65XX_65816_LONG_MX: cs_mode =
    MODE_MOS65XX_65816_LONG_M | MODE_MOS65XX_65816_LONG_X;
  export const MODE_SH2: cs_mode = 1 << 1; // SH2
  export const MODE_SH2A: cs_mode = 1 << 2; // SH2A
  export const MODE_SH3: cs_mode = 1 << 3; // SH3
  export const MODE_SH4: cs_mode = 1 << 4; // SH4
  export const MODE_SH4A: cs_mode = 1 << 5; // SH4A
  export const MODE_SHFPU: cs_mode = 1 << 6; // w/ FPU
  export const MODE_SHDSP: cs_mode = 1 << 7; // w/ DSP
  export const MODE_TRICORE_110: cs_mode = 1 << 1; // Tricore 1.1
  export const MODE_TRICORE_120: cs_mode = 1 << 2; // Tricore 1.2
  export const MODE_TRICORE_130: cs_mode = 1 << 3; // Tricore 1.3
  export const MODE_TRICORE_131: cs_mode = 1 << 4; // Tricore 1.3.1
  export const MODE_TRICORE_160: cs_mode = 1 << 5; // Tricore 1.6
  export const MODE_TRICORE_161: cs_mode = 1 << 6; // Tricore 1.6.1
  export const MODE_TRICORE_162: cs_mode = 1 << 7; // Tricore 1.6.2

  // Runtime option for the disassembled engine
  export const OPT_INVALID: cs_opt_type = 0; // No option specified
  export const OPT_SYNTAX: cs_opt_type = 1; // Intel X86 asm syntax (CS_ARCH_X86 arch Assembly output syntax)
  export const OPT_DETAIL: cs_opt_type = 2; // Break down instruction structure into details
  export const OPT_MODE: cs_opt_type = 3; // Change engine's mode at run-time
  export const OPT_MEM: cs_opt_type = 4; // Change engine's mode at run-time
  export const OPT_SKIPDATA: cs_opt_type = 5; // Skip data when disassembling
  export const OPT_SKIPDATA_SETUP: cs_opt_type = 6; // Setup user-defined function for SKIPDATA option
  export const OPT_MNEMONIC: cs_opt_type = 7; // Customize instruction mnemonic
  export const OPT_UNSIGNED: cs_opt_type = 8; // print immediate operands in unsigned form
  export const OPT_NO_BRANCH_OFFSET: cs_opt_type = 9; // ARM, prints branch immediates without offset.

  // Capstone option value
  export const OPT_OFF: cs_opt_value = 0; // Turn OFF an option - default option of CS_OPT_DETAIL
  export const OPT_ON: cs_opt_value = 3; // Turn ON an option (CS_OPT_DETAIL)

  // Capstone syntax value
  export const OPT_SYNTAX_DEFAULT: cs_opt_value = 0; // Default assembly syntax of all platforms (CS_OPT_SYNTAX)
  export const OPT_SYNTAX_INTEL: cs_opt_value = 1; // Intel X86 asm syntax - default syntax on X86 (CS_OPT_SYNTAX, CS_ARCH_X86)
  export const OPT_SYNTAX_ATT: cs_opt_value = 2; // ATT asm syntax (CS_OPT_SYNTAX, CS_ARCH_X86)
  export const OPT_SYNTAX_NOREGNAME: cs_opt_value = 3; // Asm syntax prints register name with only number - (CS_OPT_SYNTAX, CS_ARCH_PPC, CS_ARCH_ARM)
  export const OPT_SYNTAX_MASM: cs_opt_value = 4; // X86 Intel Masm syntax (CS_OPT_SYNTAX).
  export const OPT_SYNTAX_MOTOROLA: cs_opt_value = 5; // MOS65XX use $ as hex prefix.

  // Common instruction groups - to be consistent across all architectures.
  export const GRP_INVALID: cs_group_type = 0; // uninitialized/invalid group.
  export const GRP_JUMP: cs_group_type = 1; // all jump instructions (conditional+direct+indirect jumps)
  export const GRP_CALL: cs_group_type = 2; // all call instructions
  export const GRP_RET: cs_group_type = 3; // all return instructions
  export const GRP_INT: cs_group_type = 4; // all interrupt instructions (int+syscall)
  export const GRP_IRET: cs_group_type = 5; // all interrupt return instructions
  export const GRP_PRIVILEGE: cs_group_type = 6; // all privileged instructions
  export const GRP_BRANCH_RELATIVE: cs_group_type = 7; // all relative branching instructions

  // Common instruction operand types - to be consistent across all architectures.
  export const OP_INVALID: cs_op_type = 0; // Uninitialized/invalid operand.
  export const OP_REG: cs_op_type = 1; // Register operand.
  export const OP_IMM: cs_op_type = 2; // Immediate operand.
  export const OP_MEM: cs_op_type = 3; // Memory operand.
  export const OP_FP: cs_op_type = 4; // Floating-Point operand.

  // Common instruction operand access types - to be consistent across all architectures. It is possible to combine access types, for example: CS_AC_READ | CS_AC_WRITE
  export const AC_INVALID: cs_ac_type = 0; // Uninitialized/invalid access type.
  export const AC_READ: cs_ac_type = 1 << 0; // Operand read from memory or register.
  export const AC_WRITE: cs_ac_type = 1 << 1; // Operand written to memory or register.

  // query id for cs_support()
  export const SUPPORT_DIET = ARCH_ALL + 1;
  export const SUPPORT_X86_REDUCE = ARCH_ALL + 2;

  // Manifest Constants
  export const MNEMONIC_SIZE = 32;
  export const INSN_SIZE = 240;
  export const M68K_OPERAND_COUNT = 4;
  export const M680X_OPERAND_COUNT = 9;
  export const TRICORE_OP_COUNT = 8;
  export const MAX_IMPL_W_REGS = 20;
  export const MAX_IMPL_R_REGS = 20;
  export const MAX_NUM_GROUPS = 8;

  export function version(): string {
    const major_ptr: number = Memory.malloc(4);
    const minor_ptr: number = Memory.malloc(4);
    Wrapper.ccall(
      'cs_version',
      'number',
      ['pointer', 'pointer'],
      [major_ptr, minor_ptr],
    );
    const major: number = Wrapper.getValue(major_ptr, 'i32');
    const minor: number = Wrapper.getValue(minor_ptr, 'i32');
    Memory.free(major_ptr);
    Memory.free(minor_ptr);
    return `${major}.${minor}`;
  }

  export function support(query: number): boolean {
    var ret: boolean = Wrapper.ccall(
      'cs_support',
      'number',
      ['number'],
      [query],
    );
    return Boolean(ret);
  }

  export function strerror(code: number): string {
    return Wrapper.ccall('cs_strerror', 'string', ['number'], [code]);
  }

  export function errno(handle: number): cs_err {
    return Wrapper.ccall('cs_errno', 'number', ['pointer'], [handle]);
  }

  export class Capstone {
    private arch: cs_arch;
    private mode: cs_mode;
    private handle_ptr: ptr;

    constructor(arch: number, mode: number) {
      this.arch = arch;
      this.mode = mode;
      this.handle_ptr = 0;
      this.open();
      this.init(arch);
    }

    private init(arch: cs_arch) {
      const arch_map: { [key: number]: string } = {
        [cs.ARCH_ARM]: 'arm',
        [cs.ARCH_ARM64]: 'arm64',
        [cs.ARCH_AARCH64]: 'arm64',
        [cs.ARCH_MIPS]: 'mips',
        [cs.ARCH_X86]: 'x86',
        [cs.ARCH_PPC]: 'ppc',
        [cs.ARCH_SPARC]: 'sparc',
        [cs.ARCH_SYSZ]: 'sysz',
        [cs.ARCH_XCORE]: 'xcore',
        [cs.ARCH_TMS320C64X]: 'tms320c64x',
        [cs.ARCH_M680X]: 'm680x',
        [cs.ARCH_M68K]: 'm68k',
        [cs.ARCH_EVM]: 'evm',
        [cs.ARCH_MOS65XX]: 'mos65xx',
        [cs.ARCH_WASM]: 'wasm',
        [cs.ARCH_BPF]: 'bpf',
        [cs.ARCH_RISCV]: 'riscv',
        [cs.ARCH_SH]: 'sh',
        [cs.ARCH_TRICORE]: 'tricore',
        [cs.ARCH_MAX]: 'all',
        [cs.ARCH_ALL]: 'all',
      };

      const constants: { [key: string]: number } = require(
        `./constants/${arch_map[arch]}_const`,
      );

      for (const key in constants) {
        cs[key] = constants[key];
      }
    }

    private deref(insn_ptr: ptr): cs_insn {
      const insn_id: number = Memory.read(insn_ptr, 'i32');
      const insn_addr: number = Memory.read(insn_ptr + 8, 'i64');
      const insn_size: number = Memory.read(insn_ptr + 16, 'i16');
      const insn_mn: string = Wrapper.UTF8ToString(insn_ptr + 42);
      const insn_op_str: string = Wrapper.UTF8ToString(insn_ptr + 66 + 8);
      const insn_bytes: Array<number> = [];

      for (let j = 0; j < insn_size; j++) {
        const byte = Memory.read(insn_ptr + 18 + j, 'u8');
        insn_bytes.push(byte);
      }

      const insn: cs_insn = {
        id: insn_id,
        address: insn_addr,
        size: insn_size,
        mnemonic: insn_mn,
        op_str: insn_op_str,
        bytes: insn_bytes,
      };

      const detail_ptr: ptr = Memory.read(insn_ptr + 238, '*');
      if (detail_ptr != 0) insn.detail = this.get_detail(detail_ptr);
      return insn;
    }

    private ref(insn: cs_insn): ptr {
      const insn_ptr: ptr = Memory.malloc(INSN_SIZE);

      Memory.write(insn_ptr, insn.id, 'i32');
      Memory.write(insn_ptr + 8, insn.address, 'i64');
      Memory.write(insn_ptr + 16, insn.size, 'i16');
      Memory.write(insn_ptr + 42, insn.mnemonic, 'char');
      Memory.write(insn_ptr + 66 + 8, insn.op_str, 'char');

      for (let j = 0; j < insn.size; j++) {
        Memory.write(insn_ptr + 18 + j, insn.bytes[j], 'u8');
      }

      if (insn.detail) {
        const detail: ptr = insn_ptr + 238;
        const detail_ptr = Memory.malloc(1864);
        Memory.write(detail, detail_ptr, '*');
        for (let i = 0; i < insn.detail.regs_read_count; i++)
          Memory.write(detail_ptr + i, insn.detail.regs_read[i], 'i16');
        Memory.write(detail_ptr + 40, insn.detail.regs_read_count, 'ubyte');
        for (let i = 0; i < insn.detail.regs_write_count; i++)
          Memory.write(detail_ptr + 42 + i, insn.detail.regs_write[i], 'i16');
        Memory.write(detail_ptr + 82, insn.detail.regs_write_count, 'ubyte');
        for (let i = 0; i < insn.detail.groups_count; i++)
          Memory.write(detail_ptr + 83 + i, insn.detail.groups[i], 'ubyte');
        Memory.write(detail_ptr + 91, insn.detail.groups_count, 'ubyte');
        Memory.write(detail_ptr + 92, insn.detail.writeback, 'bool');
      }

      return insn_ptr;
    }

    private get_detail(pointer: ptr): cs_detail {
      const detail: cs_detail = {} as cs_detail;
      const arch_info_ptr: ptr = pointer + 96;
      const regs_read_count: number = Memory.read(pointer + 40, 'ubyte');
      const regs_write_count: number = Memory.read(pointer + 82, 'ubyte');
      const groups_count: number = Memory.read(pointer + 91, 'ubyte');

      detail.regs_write = [];
      detail.groups = [];
      detail.regs_read = [];
      detail.regs_read_count = regs_read_count;
      detail.regs_write_count = regs_write_count;
      detail.groups_count = groups_count;
      detail.writeback = Memory.read(pointer + 92, 'bool');

      for (let i = 0; i < regs_read_count; i++) {
        detail.regs_read[i] = Memory.read(pointer + 0 + i, 'ushort');
      }

      for (let i = 0; i < regs_write_count; i++) {
        detail.regs_write[i] = Memory.read(pointer + 42 + i, 'ushort');
      }

      for (let i = 0; i < groups_count; i++) {
        detail.groups[i] = Memory.read(pointer + 83 + i, 'ubyte');
      }

      let arch: any;
      let op: any;
      let op_ptr: number;

      switch (this.arch) {
        case ARCH_X86:
          detail.x86 = {};
          arch = detail.x86;
          arch.prefix = [];
          arch.opcode = [];
          const encoding_ptr: ptr = pointer + 552;
          for (let i = 0; i < 4; i++) {
            arch.prefix[i] = Memory.read(arch_info_ptr + i, 'ubyte');
            arch.opcode[i] = Memory.read(arch_info_ptr + i + 4, 'ubyte');
          }
          arch.rex = Memory.read(arch_info_ptr + 8, 'ubyte');
          arch.addr_size = Memory.read(arch_info_ptr + 9, 'ubyte');
          arch.modrm = Memory.read(arch_info_ptr + 10, 'ubyte');
          arch.sib = Memory.read(arch_info_ptr + 12, 'ubyte');
          arch.disp = Memory.read(arch_info_ptr + 16, 'long');
          arch.sib_index = Memory.read(arch_info_ptr + 24, 'i32');
          arch.sib_scale = Memory.read(arch_info_ptr + 28, 'byte');
          arch.sib_base = Memory.read(arch_info_ptr + 29, 'i32');
          arch.xop_cc = Memory.read(arch_info_ptr + 33, 'i32');
          arch.sse_cc = Memory.read(arch_info_ptr + 37, 'i32');
          arch.avx_cc = Memory.read(arch_info_ptr + 41, 'i32');
          arch.avx_sae = Memory.read(arch_info_ptr + 45, 'bool');
          arch.avx_rm = Memory.read(arch_info_ptr + 46, 'i32');
          arch.eflags = Memory.read(arch_info_ptr + 50, 'ulong');
          arch.fpu_flags = Memory.read(arch_info_ptr + 56, 'ulong');
          arch.op_count = Memory.read(arch_info_ptr + 64, 'ubyte');
          arch.encoding = {
            modrm_offset: Memory.read(encoding_ptr, 'ubyte'),
            disp_offset: Memory.read(encoding_ptr + 1, 'ubyte'),
            disp_size: Memory.read(encoding_ptr + 2, 'ubyte'),
            imm_offset: Memory.read(encoding_ptr + 3, 'ubyte'),
            imm_size: Memory.read(encoding_ptr + 4, 'ubyte'),
          };
          arch.operands = [];

          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 72 + i * 48;
            op.size = Memory.read(op_ptr + 32, 'ubyte');
            op.access = Memory.read(op_ptr + 33, 'ubyte');
            op.avx_bcast = Memory.read(op_ptr + 36, 'i32');
            op.avx_zero_opmask = Memory.read(op_ptr + 40, 'bool');
            op.type = Memory.read(op_ptr, 'i32');
            switch (op.type) {
              case cs.X86_OP_REG:
                op.reg = Memory.read(op_ptr + 8, 'i32');
                break;
              case cs.X86_OP_IMM:
                op.imm = Memory.read(op_ptr + 8, 'i64');
                break;
              case cs.X86_OP_MEM:
                op.mem = {
                  segment: Memory.read(op_ptr + 8, 'i32'),
                  base: Memory.read(op_ptr + 12, 'i32'),
                  index: Memory.read(op_ptr + 16, 'i32'),
                  scale: Memory.read(op_ptr + 20, 'i32'),
                  disp: Memory.read(op_ptr + 24, 'i64'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case cs.ARCH_ARM:
          detail.arm = {};
          arch = detail.arm;
          arch.operands = [];
          arch.usermode = Memory.read(arch_info_ptr, 'bool');
          arch.vector_size = Memory.read(arch_info_ptr + 4, 'i32');
          arch.vector_data = Memory.read(arch_info_ptr + 9, 'i32');
          arch.cps_mode = Memory.read(arch_info_ptr + 12, 'i32');
          arch.cps_flag = Memory.read(arch_info_ptr + 16, 'i32');
          arch.cc = Memory.read(arch_info_ptr + 20, 'i32');
          arch.update_flags = Memory.read(arch_info_ptr + 24, 'bool');
          arch.writeback = Memory.read(arch_info_ptr + 25, 'bool');
          arch.post_index = Memory.read(arch_info_ptr + 26, 'bool');
          arch.mem_barrier = Memory.read(arch_info_ptr + 28, 'i32');
          arch.op_count = Memory.read(arch_info_ptr + 32, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 40 + i * 48;
            op.vector_index = Memory.read(op_ptr + 0, 'i32');
            op.shift = {
              type: Memory.read(op_ptr + 4, 'i32'),
              value: Memory.read(op_ptr + 8, 'u32'),
            };
            op.subtracted = Memory.read(op_ptr + 40, 'bool');
            op.access = Memory.read(op_ptr + 41, 'ubyte');
            op.neon_lane = Memory.read(op_ptr + 42, 'i8');
            op.type = Memory.read(op_ptr + 12, 'i32');
            switch (op.type) {
              case cs.ARM_OP_SYSREG:
              case cs.ARM_OP_REG:
                op.reg = Memory.read(op_ptr + 16, 'i32');
                break;
              case cs.ARM_OP_IMM:
              case cs.ARM_OP_PIMM:
              case cs.ARM_OP_PIMM:
                op.imm = Memory.read(op_ptr + 16, 'i32');
                break;
              case cs.ARM_OP_FP:
                op.fp = Memory.read(op_ptr + 16, 'double');
                break;
              case cs.ARM_OP_SETEND:
                op.setend = Memory.read(op_ptr + 16, 'i32');
                break;
              case cs.ARM_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 16, 'i32'),
                  index: Memory.read(op_ptr + 20, 'i32'),
                  scale: Memory.read(op_ptr + 24, 'i32'),
                  disp: Memory.read(op_ptr + 28, 'i32'),
                  lshift: Memory.read(op_ptr + 32, 'i32'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_ARM64:
          detail.arm64 = {};
          arch = detail.arm64;
          arch.operands = [];
          arch.cc = Memory.read(arch_info_ptr, 'i32');
          arch.update_flags = Memory.read(arch_info_ptr + 4, 'bool');
          arch.writeback = Memory.read(arch_info_ptr + 5, 'bool');
          arch.post_index = Memory.read(arch_info_ptr + 6, 'bool');
          arch.op_count = Memory.read(arch_info_ptr + 7, 'i8');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 8 + i * 56;
            op.vector_index = Memory.read(op_ptr + 0, 'i32');
            op.vas = Memory.read(op_ptr + 4, 'i32');
            op.shift = {
              type: Memory.read(op_ptr + 8, 'i32'),
              value: Memory.read(op_ptr + 12, 'i32'),
            };
            op.ext = Memory.read(op_ptr + 16, 'i32');
            op.access = Memory.read(op_ptr + 48, 'i32');
            op.type = Memory.read(op_ptr + 20, 'i32');
            switch (op.type) {
              case cs.ARM64_OP_REG:
              case cs.ARM64_OP_REG_MRS:
              case cs.ARM64_OP_REG_MSR:
                op.reg = Memory.read(op_ptr + 32, 'i32');
                break;
              case cs.ARM64_OP_IMM:
              case cs.ARM64_OP_CIMM:
                op.imm = Memory.read(op_ptr + 32, 'i64');
                break;
              case cs.ARM64_OP_FP:
                op.fp = Memory.read(op_ptr + 32, 'double');
                break;
              case cs.ARM64_OP_PSTATE:
                op.pstate = Memory.read(op_ptr + 32, 'i32');
                break;
              case cs.ARM64_OP_SYS:
                op.sys = Memory.read(op_ptr + 32, 'i32');
                break;
              case cs.ARM64_OP_SVCR:
                op.svcr = Memory.read(op_ptr + 24, 'i32');
                break;
              case cs.ARM64_OP_BARRIER:
                op.barrier = Memory.read(op_ptr + 32, 'i32');
                break;
              case cs.ARM64_OP_PREFETCH:
                op.prefetch = Memory.read(op_ptr + 32, 'i32');
                break;
              case cs.ARM64_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 32, 'i32'),
                  index: Memory.read(op_ptr + 36, 'i32'),
                  disp: Memory.read(op_ptr + 40, 'i32'),
                };
                break;
              case cs.ARM64_OP_SME_INDEX:
                op.sme_index = {
                  reg: Memory.read(op_ptr + 32, 'i32'),
                  base: Memory.read(op_ptr + 36, 'i32'),
                  disp: Memory.read(op_ptr + 40, 'i32'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_M68K:
          detail.m68k = {};
          arch = detail.m68k;
          arch.operands = [];
          arch.op_count = Memory.read(arch_info_ptr + 232, 'ubyte');
          arch.op_size = {
            type: Memory.read(arch_info_ptr + 224, 'i32'),
          };
          switch (arch.op_size.type) {
            case cs.M68K_SIZE_TYPE_CPU:
              arch.op_size.cpu_size = Memory.read(arch_info_ptr + 228, 'i32');
              break;
            case cs.M68K_SIZE_TYPE_FPU:
              arch.op_size.fpu_size = Memory.read(arch_info_ptr + 228, 'i32');
              break;
          }
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + i * 56;
            op.address_mode = Memory.read(op_ptr + 52, 'i32');
            op.type = Memory.read(op_ptr + 48, 'i32');
            switch (op.type) {
              case cs.M68K_OP_REG:
                op.reg = Memory.read(op_ptr + 0, 'i32');
                break;
              case cs.M68K_OP_IMM:
                op.imm = Memory.read(op_ptr + 0, 'ulong');
                break;
              case cs.M68K_OP_MEM:
                op.mem = {
                  base_reg: Memory.read(op_ptr + 8, 'i32'),
                  index_reg: Memory.read(op_ptr + 12, 'i32'),
                  in_base_reg: Memory.read(op_ptr + 16, 'i32'),
                  in_disp: Memory.read(op_ptr + 20, 'u32'),
                  out_disp: Memory.read(op_ptr + 24, 'i32'),
                  disp: Memory.read(op_ptr + 28, 'short'),
                  scale: Memory.read(op_ptr + 30, 'ubyte'),
                  bitfield: Memory.read(op_ptr + 31, 'ubyte'),
                  width: Memory.read(op_ptr + 32, 'ubyte'),
                  offset: Memory.read(op_ptr + 33, 'ubyte'),
                  index_size: Memory.read(op_ptr + 34, 'ubyte'),
                };
                break;
              case cs.M68K_OP_FP_DOUBLE:
                op.dimm = Memory.read(op_ptr + 0, 'double');
                break;
              case cs.M68K_OP_FP_SINGLE:
                op.simm = Memory.read(op_ptr + 0, 'float');
                break;
              case cs.M68K_OP_REG_BITS:
                op.register_bits = Memory.read(op_ptr + 44, 'i32');
                break;
              case cs.M68K_OP_REG_PAIR:
                op.reg_pair = {
                  reg_0: Memory.read(op_ptr + 0, 'i32'),
                  reg_1: Memory.read(op_ptr + 4, 'i32'),
                };
                break;
              case cs.M68K_OP_BR_DISP:
                op.br_disp = {
                  disp: Memory.read(op_ptr + 36, 'i32'),
                  disp_size: Memory.read(op_ptr + 40, 'ubyte'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_MIPS:
          detail.mips = {};
          arch = detail.mips;
          arch.operands = [];
          arch.op_count = Memory.read(arch_info_ptr, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 8 + i * 24;
            op.type = Memory.read(op_ptr + 0, 'i32');
            switch (op.type) {
              case cs.MIPS_OP_REG:
                op.reg = Memory.read(op_ptr + 8, 'i32');
                break;
              case cs.MIPS_OP_IMM:
                op.imm = Memory.read(op_ptr + 8, 'long');
                break;
              case cs.MIPS_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 8, 'i32'),
                  disp: Memory.read(op_ptr + 12, 'long'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_PPC:
          detail.ppc = {};
          arch = detail.ppc;
          arch.operands = [];
          arch.bc = Memory.read(arch_info_ptr + 0, 'i32');
          arch.bh = Memory.read(arch_info_ptr + 4, 'i32');
          arch.update_cr0 = Memory.read(arch_info_ptr + 8, 'bool');
          arch.op_count = Memory.read(arch_info_ptr + 9, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 16 + i * 24;
            op.type = Memory.read(op_ptr, 'i32');
            switch (op.type) {
              case cs.PPC_OP_REG:
                op.reg = Memory.read(op_ptr + 8, 'i32');
                break;
              case cs.PPC_OP_IMM:
                op.imm = Memory.read(op_ptr + 8, 'long');
                break;
              case cs.PPC_OP_CRX:
                op.crx = {
                  scale: Memory.read(op_ptr + 8, 'u32'),
                  reg: Memory.read(op_ptr + 12, 'i32'),
                  cond: Memory.read(op_ptr + 16, 'i32'),
                };
                break;
              case cs.PPC_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 8, 'i32'),
                  disp: Memory.read(op_ptr + 12, 'i32'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_SPARC:
          detail.sparc = {};
          arch = detail.sparc;
          arch.operands = [];
          arch.cc = Memory.read(arch_info_ptr + 0, 'i32');
          arch.hint = Memory.read(arch_info_ptr + 4, 'i32');
          arch.op_count = Memory.read(arch_info_ptr + 8, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 16 + i * 16;
            op.type = Memory.read(op_ptr + 0, 'i32');
            switch (op.type) {
              case cs.SPARC_OP_REG:
                op.reg = Memory.read(op_ptr + 8, 'i32');
                break;
              case cs.SPARC_OP_IMM:
                op.imm = Memory.read(op_ptr + 8, 'long');
                break;
              case cs.SPARC_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 8, 'ubyte'),
                  index: Memory.read(op_ptr + 9, 'ubyte'),
                  disp: Memory.read(op_ptr + 12, 'i32'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_SYSZ:
          detail.sysz = {};
          arch = detail.sysz;
          arch.operands = [];
          arch.cc = Memory.read(arch_info_ptr + 0, 'i32');
          arch.op_count = Memory.read(arch_info_ptr + 4, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 8 + i * 32;
            op.type = Memory.read(op_ptr + 0, 'i32');
            switch (op.type) {
              case cs.SYSZ_OP_REG:
                op.reg = Memory.read(op_ptr + 8, 'i32');
                break;
              case cs.SYSZ_OP_IMM:
                op.imm = Memory.read(op_ptr + 8, 'i64');
                break;
              case cs.SYSZ_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 8, 'ubyte'),
                  index: Memory.read(op_ptr + 9, 'ubyte'),
                  length: Memory.read(op_ptr + 16, 'ulong'),
                  disp: Memory.read(op_ptr + 24, 'long'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_XCORE:
          detail.xcore = {};
          arch = detail.xcore;
          arch.operands = [];
          arch.op_count = Memory.read(arch_info_ptr + 0, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 4 + i * 16;
            op.type = Memory.read(op_ptr + 0, 'i32');
            switch (op.type) {
              case cs.XCORE_OP_REG:
                op.reg = Memory.read(op_ptr + 4, 'i32');
                break;
              case cs.XCORE_OP_IMM:
                op.imm = Memory.read(op_ptr + 4, 'i32');
                break;
              case cs.XCORE_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 4, 'ubyte'),
                  index: Memory.read(op_ptr + 5, 'ubyte'),
                  disp: Memory.read(op_ptr + 8, 'i32'),
                  direct: Memory.read(op_ptr + 12, 'i32'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_TMS320C64X:
          detail.tms320c64x = {};
          arch = detail.tms320c64x;
          arch.operands = [];
          arch.op_count = Memory.read(arch_info_ptr + 0, 'ubyte');
          arch.condition = {
            reg: Memory.read(arch_info_ptr + 260, 'i32'),
            zero: Memory.read(arch_info_ptr + 264, 'i32'),
          };
          arch.funit = {
            unit: Memory.read(arch_info_ptr + 268, 'u32'),
            side: Memory.read(arch_info_ptr + 272, 'u32'),
            crosspath: Memory.read(arch_info_ptr + 276, 'u32'),
          };
          arch.parallel = Memory.read(arch_info_ptr + 280, 'u32');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 4 + i * 32;
            op.type = Memory.read(op_ptr, 'i32');
            switch (op.type) {
              case cs.TMS320C64X_OP_REG:
                op.reg = Memory.read(op_ptr + 4, 'u32');
                break;
              case cs.TMS320C64X_OP_IMM:
                op.imm = Memory.read(op_ptr + 4, 'i32');
                break;
              case cs.TMS320C64X_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 4, 'u32'),
                  disp: Memory.read(op_ptr + 8, 'i32'),
                  unit: Memory.read(op_ptr + 12, 'i32'),
                  scaled: Memory.read(op_ptr + 16, 'i32'),
                  disptype: Memory.read(op_ptr + 20, 'i32'),
                  direction: Memory.read(op_ptr + 24, 'i32'),
                  modify: Memory.read(op_ptr + 28, 'i32'),
                };
                break;
              case cs.TMS320C64X_OP_REGPAIR:
                op.reg = Memory.read(op_ptr + 4, 'u32');
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_M680X:
          detail.m680x = {};
          arch = detail.m680x;
          arch.operands = [];
          arch.flags = Memory.read(arch_info_ptr + 0, 'ubyte');
          arch.op_count = Memory.read(arch_info_ptr + 1, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 4 + i * 24;
            op.type = Memory.read(op_ptr, 'i32');
            op.size = Memory.read(op_ptr + 20, 'ubyte');
            op.access = Memory.read(op_ptr + 21, 'ubyte');
            switch (op.type) {
              case cs.M680X_OP_IMMEDIATE:
                op.imm = Memory.read(op_ptr + 4, 'i32');
                break;
              case cs.M680X_OP_REGISTER:
                op.reg = Memory.read(op_ptr + 4, 'i32');
                break;
              case cs.M680X_OP_INDEXED:
                op.idx = {
                  base_reg: Memory.read(op_ptr + 4, 'i32'),
                  offset_reg: Memory.read(op_ptr + 8, 'i32'),
                  offset: Memory.read(op_ptr + 12, 'short'),
                  offset_addr: Memory.read(op_ptr + 14, 'ushort'),
                  offset_bits: Memory.read(op_ptr + 16, 'ubyte'),
                  inc_dec: Memory.read(op_ptr + 17, 'byte'),
                  flags: Memory.read(op_ptr + 18, 'ubyte'),
                };
                break;
              case cs.M680X_OP_RELATIVE:
                op.rel = {
                  address: Memory.read(op_ptr + 4, 'ushort'),
                  offset: Memory.read(op_ptr + 6, 'short'),
                };
                break;
              case cs.M680X_OP_EXTENDED:
                op.ext = {
                  address: Memory.read(op_ptr + 4, 'ushort'),
                  indirect: Memory.read(op_ptr + 6, 'bool'),
                };
                break;
              case cs.M680X_OP_DIRECT:
                op.direct_addr = Memory.read(op_ptr + 4, 'ubyte');
                break;
              case cs.M680X_OP_CONSTANT:
                op.const_val = Memory.read(op_ptr + 4, 'ubyte');
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_EVM:
          detail.evm = {};
          arch = detail.evm;
          arch.pop = Memory.read(arch_info_ptr + 0, 'ubyte');
          arch.push = Memory.read(arch_info_ptr + 1, 'ubyte');
          arch.fee = Memory.read(arch_info_ptr + 4, 'ubyte');
          break;
        case ARCH_MOS65XX:
          detail.mos65xx = {};
          arch = detail.mos65xx;
          arch.operands = [];
          arch.am = Memory.read(arch_info_ptr + 0, 'i32');
          arch.modifies_flags = Memory.read(arch_info_ptr + 4, 'bool');
          arch.op_count = Memory.read(arch_info_ptr + 5, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 8 + i * 8;
            op.type = Memory.read(op_ptr, 'i32');
            switch (op.type) {
              case cs.MOS65XX_OP_REG:
                op.reg = Memory.read(op_ptr + 4, 'i32');
                break;
              case cs.MOS65XX_OP_IMM:
                op.imm = Memory.read(op_ptr + 4, 'i32');
                break;
              case cs.MOS65XX_OP_MEM:
                op.mem = Memory.read(op_ptr + 4, 'i32');
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_WASM:
          detail.wasm = {};
          arch = detail.wasm;
          arch.operands = [];
          arch.op_count = Memory.read(arch_info_ptr + 0, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 8 + i * 32;
            op.type = Memory.read(op_ptr, 'i32');
            op.size = Memory.read(op_ptr + 4, 'i32');
            switch (op.type) {
              case cs.WASM_OP_INT7:
                op.int7 = Memory.read(op_ptr + 8, 'ubyte');
                break;
              case cs.WASM_OP_VARUINT32:
                op.varuint32 = Memory.read(op_ptr + 8, 'u32');
                break;
              case cs.WASM_OP_VARUINT64:
                op.varuint64 = Memory.read(op_ptr + 8, 'u64');
                break;
              case cs.WASM_OP_UINT32:
                op.uint32 = Memory.read(op_ptr + 8, 'u32');
                break;
              case cs.WASM_OP_UINT64:
                op.uint64 = Memory.read(op_ptr + 8, 'u64');
                break;
              case cs.WASM_OP_IMM:
                op.imm = [];
                for (let i = 0; i < 2; i++)
                  op.imm[i] = Memory.read(op_ptr + 8 + i, 'u32');
                break;
              case cs.WASM_OP_BRTABLE:
                op.brtable = {
                  length: Memory.read(op_ptr + 8, 'u32'),
                  address: Memory.read(op_ptr + 12, 'u64'),
                  default_target: Memory.read(op_ptr + 20, 'u32'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_BPF:
          detail.bpf = {};
          arch = detail.bpf;
          arch.operands = [];
          arch.op_count = Memory.read(arch_info_ptr + 0, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 8 + i * 24;
            op.type = Memory.read(op_ptr + 0, 'i32');
            op.access = Memory.read(op_ptr + 16, 'u32');
            switch (op.type) {
              case cs.BPF_OP_REG:
                op.reg = Memory.read(op_ptr + 8, 'ubyte');
                break;
              case cs.BPF_OP_IMM:
                op.imm = Memory.read(op_ptr + 8, 'i64');
                break;
              case cs.BPF_OP_OFF:
                op.off = Memory.read(op_ptr + 8, 'u32');
                break;
              case cs.BPF_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 8, 'i32'),
                  disp: Memory.read(op_ptr + 12, 'u32'),
                };
                break;
              case cs.BPF_OP_MMEM:
                op.mmem = Memory.read(op_ptr + 8, 'u32');
                break;
              case cs.BPF_OP_MSH:
                op.msh = Memory.read(op_ptr + 8, 'u32');
                break;
              case cs.BPF_OP_EXT:
                op.ext = Memory.read(op_ptr + 8, 'u32');
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_RISCV:
          detail.riscv = {};
          arch = detail.riscv;
          arch.operands = [];
          arch.need_effective_addr = Memory.read(arch_info_ptr + 0, 'bool');
          arch.op_count = Memory.read(arch_info_ptr + 1, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 8 + i * 24;
            op.type = Memory.read(op_ptr + 0, 'i32');
            switch (op.type) {
              case cs.RISCV_OP_REG:
                op.reg = Memory.read(op_ptr + 8, 'u32');
                break;
              case cs.RISCV_OP_IMM:
                op.imm = Memory.read(op_ptr + 8, 'i32');
                break;
              case cs.RISCV_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 8, 'u32'),
                  disp: Memory.read(op_ptr + 16, 'i64'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_SH:
          detail.sh = {};
          arch = detail.sh;
          arch.operands = [];
          arch.insn = Memory.read(arch_info_ptr + 0, 'u32');
          arch.size = Memory.read(arch_info_ptr + 4, 'ubyte');
          arch.op_count = Memory.read(arch_info_ptr + 5, 'ubyte');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 8 + i * 58;
            op.type = Memory.read(op_ptr + 0, 'i32');
            switch (op.type) {
              case cs.SH_OP_IMM:
                op.imm = Memory.read(op_ptr + 8, 'i64');
                break;
              case cs.SH_OP_REG:
                op.reg = Memory.read(op_ptr + 8, 'i32');
                break;
              case cs.SH_OP_MEM:
                op.mem = {
                  address: Memory.read(op_ptr + 8, 'i32'),
                  reg: Memory.read(op_ptr + 12, 'i32'),
                  disp: Memory.read(op_ptr + 16, 'i32'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
        case ARCH_TRICORE:
          detail.tricore = {};
          arch = detail.tricore;
          arch.operands = [];
          arch.op_count = Memory.read(arch_info_ptr + 0, 'ubyte');
          arch.update_flags = Memory.read(arch_info_ptr + 132, 'bool');
          for (let i = 0; i < arch.op_count; i++) {
            op = {};
            op_ptr = arch_info_ptr + 4 + i * 16;
            op.type = Memory.read(op_ptr + 0, 'i32');
            switch (op.type) {
              case cs.TRICORE_OP_REG:
                op.reg = Memory.read(op_ptr + 4, 'u32');
                break;
              case cs.TRICORE_OP_IMM:
                op.imm = Memory.read(op_ptr + 4, 'i32');
                break;
              case cs.TRICORE_OP_MEM:
                op.mem = {
                  base: Memory.read(op_ptr + 4, 'ubyte'),
                  disp: Memory.read(op_ptr + 8, 'i32'),
                };
                break;
            }
            arch.operands[i] = op;
          }
          break;
      }
      return detail;
    }

    public option(
      option: cs_opt_type,
      value: cs_opt_value | boolean | cs_opt_mnem | cs_opt_skipdata,
    ): void {
      const handle: csh = Memory.read(this.handle_ptr, '*');

      if (!handle) {
        return;
      }

      let opt_val: any = 0;

      if (option === OPT_MNEMONIC) {
        if (
          typeof value !== 'object' ||
          value === undefined ||
          value === null ||
          ((value as cs_opt_mnem).id === undefined &&
            (value as cs_opt_mnem).mnemonic === undefined) ||
          ((value as cs_opt_mnem).id !== undefined &&
            typeof (value as cs_opt_mnem).id !== 'number') ||
          ((value as cs_opt_mnem).mnemonic !== undefined &&
            typeof (value as cs_opt_mnem).mnemonic !== 'string')
        ) {
          throw new Error(
            'When using cs.OPT_MNEMONIC, the value parameter needs to be an object with the following properties,: { id: number, mnemonic: string | null }',
          );
        }

        let str_ptr;
        const mnemonic_len = (value as cs_opt_mnem).mnemonic.length;
        if ((value as cs_opt_mnem).mnemonic) {
          str_ptr = Memory.malloc(mnemonic_len + 1);
          for (let i = 0; i < (value as cs_opt_mnem).mnemonic.length; i++) {
            Memory.write(
              str_ptr + i,
              (value as cs_opt_mnem).mnemonic.charCodeAt(i),
              'i8',
            );
          }
          Memory.write(str_ptr + mnemonic_len, 0, 'i8');
        } else {
          str_ptr = Memory.malloc(1);
          Memory.write(str_ptr, 0, 'i8');
        }
        const obj_ptr = Memory.malloc(8);
        Memory.write(obj_ptr, (value as cs_opt_mnem).id, 'i32');
        Memory.write(obj_ptr + 4, str_ptr, 'i32');

        opt_val = obj_ptr;
      } else if (option === OPT_SKIPDATA_SETUP) {
        // TODO
      } else {
        opt_val =
          typeof value === 'boolean' ? (value ? OPT_ON : OPT_OFF) : value;
      }

      const ret: cs_err = Wrapper.ccall(
        'cs_option',
        'number',
        ['pointer', 'number', 'number'],
        [handle, option, opt_val],
      );

      if (ret !== ERR_OK) {
        const error = new Error(
          `capstone: Function cs_option failed with code ${ret}:\n${strerror(ret)}`,
        );
        throw error;
      }

      if (option === OPT_MNEMONIC && opt_val !== 0) {
        Memory.free(Memory.read(opt_val, '*'));
        Memory.free(opt_val);
      }
    }

    private open(): void {
      this.handle_ptr = Memory.malloc(4);
      const ret: cs_err = Wrapper.ccall(
        'cs_open',
        'number',
        ['number', 'number', 'number'],
        [this.arch, this.mode, this.handle_ptr],
      );
      if (ret != ERR_OK) {
        Memory.write(this.handle_ptr, 0, '*');
        const error =
          'capstone: Function cs_open failed with code ' +
          ret +
          ':\n' +
          strerror(ret);
        throw error;
      }
    }

    public close(): void {
      const ret: cs_err = Wrapper.ccall(
        'cs_close',
        'number',
        ['pointer'],
        [this.handle_ptr],
      );
      if (ret != ERR_OK) {
        const error =
          'capstone: Function cs_close failed with code ' +
          ret +
          ':\n' +
          strerror(ret);
        throw error;
      }

      Memory.allocations.delete(this.handle_ptr);

      if (Memory.allocations.size !== 0) Memory.free(Memory.allocations);
    }

    public disasm(
      buffer: Buffer | Array<number> | Uint8Array,
      addr: number,
      max_len?: number,
    ): cs_insn[] {
      const handle: csh = Memory.read(this.handle_ptr, 'i32');
      const buffer_len: number = buffer.length;
      const buffer_ptr: ptr = Memory.malloc(buffer_len);
      const insn_ptr: ptr = Memory.malloc(4);

      Wrapper.writeArrayToMemory(buffer, buffer_ptr);

      const insn_count: number = Wrapper.ccall(
        'cs_disasm',
        'number',
        ['number', 'number', 'number', 'number', 'number', 'number'],
        [handle, buffer_ptr, buffer_len, addr, 0, max_len || 0, insn_ptr],
      );

      if (insn_count > 0) {
        const insn_arr_ptr: ptr = Memory.read(insn_ptr, 'i32');
        const instructions: cs_insn[] = [];

        for (let i = 0; i < insn_count; i++) {
          const insnOffset: ptr = insn_arr_ptr + i * INSN_SIZE;
          const insn: cs_insn = this.deref(insnOffset);
          instructions.push(insn);
        }
        Memory.free([insn_ptr, buffer_ptr]);
        return instructions;
      } else {
        Memory.free([insn_ptr, buffer_ptr]);

        const code: cs_err = cs.errno(handle);
        const error =
          'capstone: Function cs_disasm failed with code ' +
          code +
          ':\n' +
          strerror(code);
        throw error;
      }
    }

    public disasm_iter(data: {
      buffer: Buffer | Array<number> | Uint8Array;
      addr: number;
      insn: {} | cs_insn | null;
    }): boolean {
      const { buffer, addr } = data;
      const handle: csh = Wrapper.getValue(this.handle_ptr, 'i32');
      const buffer_len: number = buffer.length;
      const code_mem: ptr = Memory.malloc(buffer.length);
      const cast_ptr: ptr = Memory.malloc(24);
      const code_ptr: ptr = cast_ptr;
      const size_ptr: ptr = cast_ptr + 8;
      const addr_ptr: ptr = cast_ptr + 16;
      const insn_ptr: ptr = Wrapper._cs_malloc(handle);

      Memory.write(addr_ptr, addr, 'i64');
      Memory.write(size_ptr, buffer_len, 'i32');
      Wrapper.writeArrayToMemory(buffer, code_mem);
      Memory.write(code_ptr, code_mem, 'i32');

      const ret: boolean = Wrapper.ccall(
        'cs_disasm_iter',
        'boolean',
        ['number', 'number', 'number', 'number', 'pointer'],
        [handle, code_ptr, size_ptr, addr_ptr, insn_ptr],
      );

      if (ret) {
        const new_addr: number = Memory.read(addr_ptr, 'i64');
        const new_size: number = Memory.read(size_ptr, 'i16');
        const new_bytes = [];
        for (let j = 0; j < new_size; j++) {
          const byte = Memory.read(Memory.read(code_ptr, 'i32') + j, 'u8');
          new_bytes.push(byte);
        }

        const insn: cs_insn = this.deref(insn_ptr);

        data.buffer = Buffer.from(new_bytes);
        data.addr = new_addr;
        data.insn = insn;
      }
      Memory.free(code_mem);
      Memory.free(cast_ptr);
      Wrapper._cs_free(insn_ptr, 1);

      return ret;
    }

    public regs_access(
      insn: cs_insn,
      regs_read: cs_regs,
      regs_read_count: number,
      regs_write: cs_regs,
      regs_write_count: number,
    ): cs_err {
      throw 'TODO';
    }

    public op_count(insn: cs_insn, op_type: number): number {
      throw 'TODO';
    }

    public op_index(insn: cs_insn, op_type: number, position: number): number {
      throw 'TODO';
    }

    public insn_group(insn: cs_insn, group_id: number): boolean {
      throw 'TODO';
    }

    public reg_read(insn: cs_insn, reg_id: number): boolean {
      throw 'TODO';
    }

    public reg_write(insn: cs_insn, reg_id: number): boolean {
      throw 'TODO';
    }

    public group_name(group_id: number): string {
      const handle: csh = Memory.read(this.handle_ptr, '*');
      const ret: string = Wrapper.ccall(
        'cs_group_name',
        'string',
        ['pointer', 'number'],
        [handle, group_id],
      );
      return ret;
    }

    public reg_name(reg_id: number): string {
      const handle: csh = Memory.read(this.handle_ptr, '*');
      const ret: string = Wrapper.ccall(
        'cs_reg_name',
        'string',
        ['pointer', 'number'],
        [handle, reg_id],
      );
      return ret;
    }

    public insn_name(insn_id: number): string {
      const handle: csh = Memory.read(this.handle_ptr, '*');
      const ret: string = Wrapper.ccall(
        'cs_insn_name',
        'string',
        ['pointer', 'number'],
        [handle, insn_id],
      );
      return ret;
    }
  }
}

declare namespace cs {
  const X86_OP_REG: number;
  const X86_OP_IMM: number;
  const X86_OP_MEM: number;
  const ARM64_OP_REG: number;
  const ARM64_OP_REG_MRS: number;
  const ARM64_OP_REG_MSR: number;
  const ARM64_OP_CIMM: number;
  const ARM64_OP_IMM: number;
  const ARM64_OP_FP: number;
  const ARM64_OP_PSTATE: number;
  const ARM64_OP_SYS: number;
  const ARM64_OP_BARRIER: number;
  const ARM64_OP_PREFETCH: number;
  const ARM64_OP_MEM: number;
  const ARM64_OP_SVCR: number;
  const ARM64_OP_SME_INDEX: number;
  const M68K_OP_REG: number;
  const M68K_OP_IMM: number;
  const M68K_OP_FP_DOUBLE: number;
  const M68K_OP_FP_SINGLE: number;
  const M68K_OP_REG_PAIR: number;
  const M68K_OP_REG_BITS: number;
  const M68K_OP_BR_DISP: number;
  const M68K_OP_MEM: number;
  const MIPS_OP_REG: number;
  const MIPS_OP_IMM: number;
  const MIPS_OP_MEM: number;
  const PPC_OP_REG: number;
  const PPC_OP_IMM: number;
  const PPC_OP_CRX: number;
  const PPC_OP_MEM: number;
  const SPARC_OP_REG: number;
  const SPARC_OP_IMM: number;
  const SPARC_OP_MEM: number;
  const SYSZ_OP_REG: number;
  const SYSZ_OP_IMM: number;
  const SYSZ_OP_MEM: number;
  const XCORE_OP_REG: number;
  const XCORE_OP_IMM: number;
  const XCORE_OP_MEM: number;
  const ARM_OP_REG: number;
  const ARM_OP_IMM: number;
  const ARM_OP_PIMM: number;
  const ARM_OP_FP: number;
  const ARM_OP_SETEND: number;
  const ARM_OP_MEM: number;
  const ARM_OP_SYSREG: number;
  const M68K_SIZE_TYPE_CPU: number;
  const M68K_SIZE_TYPE_FPU: number;
  const TMS320C64X_OP_REG: number;
  const TMS320C64X_OP_IMM: number;
  const TMS320C64X_OP_MEM: number;
  const TMS320C64X_OP_REGPAIR: number;
  const M680X_OP_IMMEDIATE: number;
  const M680X_OP_REGISTER: number;
  const M680X_OP_INDEXED: number;
  const M680X_OP_RELATIVE: number;
  const M680X_OP_EXTENDED: number;
  const M680X_OP_DIRECT: number;
  const M680X_OP_CONSTANT: number;
  const MOS65XX_OP_REG: number;
  const MOS65XX_OP_IMM: number;
  const MOS65XX_OP_MEM: number;
  const WASM_OP_INT7: number;
  const WASM_OP_VARUINT32: number;
  const WASM_OP_VARUINT64: number;
  const WASM_OP_UINT32: number;
  const WASM_OP_UINT64: number;
  const WASM_OP_IMM: number;
  const WASM_OP_BRTABLE: number;
  const BPF_OP_REG: number;
  const BPF_OP_IMM: number;
  const BPF_OP_OFF: number;
  const BPF_OP_MEM: number;
  const BPF_OP_MMEM: number;
  const BPF_OP_MSH: number;
  const BPF_OP_EXT: number;
  const RISCV_OP_REG: number;
  const RISCV_OP_IMM: number;
  const RISCV_OP_MEM: number;
  const SH_OP_REG: number;
  const SH_OP_IMM: number;
  const SH_OP_MEM: number;
  const TRICORE_OP_REG: number;
  const TRICORE_OP_IMM: number;
  const TRICORE_OP_MEM: number;
}

export default cs;
export {
  Wrapper,
  cs_opt_skipdata,
  cs_opt_mnem,
  cs_insn,
  cs_detail,
  cs_arch,
  cs_mode,
  cs_err,
  cs_opt_type,
  cs_opt_value,
  cs_group_type,
  cs_op_type,
  cs_ac_type,
  cs_regs,
};
