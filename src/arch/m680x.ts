export interface cs_m680x_op {
  type: M680X;
  imm?: number; // immediate value for IMM operand
  reg?: M680X; // register value for REG operand
  idx?: {
    // Indexed addressing operand
    base_reg: M680X; // base register (or M680X.REG_INVALID if irrelevant)
    offset_reg: M680X; // offset register (or M680X.REG_INVALID if irrelevant)
    offset: number; // 5-,8- or 16-bit offset. See also offset_bits.
    offset_addr: number; // = offset addr. if base_reg == M680X.REG_PC. calculated as offset + PC
    offset_bits: number; // offset width in bits for indexed addressing
    inc_dec: number; // inc. or dec. value: 0: no inc-/decrement, 1 .. 8: increment by 1 .. 8, -1 .. -8: decrement by 1 .. 8, if flag M680X.IDX_POST_INC_DEC set it is post inc-/decrement otherwise pre inc-/decrement
    flags: number; // 8-bit flags (see above)
  };
  rel?: {
    // Relative address. operand (Bcc/LBcc)
    address: number; // The absolute address. calculated as PC + offset. PC is the first address after the instruction.
    offset: number; // the offset/displacement value
  };
  ext?: {
    // Extended address
    address: number; // The absolute address
    indirect: boolean; // true if extended indirect addressing
  };
  direct_addr?: number; //</ Direct address (lower 8-bit)
  const_val?: number; // constant value (bit index, page nr.)
  size: number; // size of this operand (in bytes)
  /// How is this operand accessed? (READ, WRITE or READ|WRITE)
  /// This field is combined of cs_ac_type.
  access: number;
}

export enum M680X {
  OPERAND_COUNT = 9,

  // M680X registers and special registers
  REG_INVALID = 0,
  REG_A = 1, // M6800/1/2/3/9, HD6301/9
  REG_B = 2, // M6800/1/2/3/9, HD6301/9
  REG_E = 3, // HD6309
  REG_F = 4, // HD6309
  REG_0 = 5, // HD6309

  REG_D = 6, // M6801/3/9, HD6301/9
  REG_W = 7, // HD6309

  REG_CC = 8, // M6800/1/2/3/9, M6301/9
  REG_DP = 9, // M6809/M6309
  REG_MD = 10, // M6309

  REG_HX = 11, // M6808
  REG_H = 12, // M6808
  REG_X = 13, // M6800/1/2/3/9, M6301/9
  REG_Y = 14, // M6809/M6309
  REG_S = 15, // M6809/M6309
  REG_U = 16, // M6809/M6309
  REG_V = 17, // M6309

  REG_Q = 18, // M6309

  REG_PC = 19, // M6800/1/2/3/9, M6301/9

  REG_TMP2 = 20, // CPU12
  REG_TMP3 = 21, // CPU12

  REG_ENDING = 22, // mark the end of the list of registers

  // Operand type for instruction's operands
  OP_INVALID = 0, // CS_OP_INVALID (Uninitialized).
  OP_REGISTER = 1, // Register operand.
  OP_IMMEDIATE = 2, // Immediate operand.
  OP_INDEXED = 3, // Indexed addressing operand.
  OP_EXTENDED = 4, // Extended addressing operand.
  OP_DIRECT = 5, // Direct addressing operand.
  OP_RELATIVE = 6, // Relative addressing operand.
  OP_CONSTANT = 7, // constant operand (Displayed as number only).

  // Supported bit values for mem.idx.offset_bits
  OFFSET_NONE = 0,
  OFFSET_BITS_5 = 5,
  OFFSET_BITS_8 = 8,
  OFFSET_BITS_9 = 9,
  OFFSET_BITS_16 = 16,

  // Supported bit flags for mem.idx.flags
  // These flags can be combined
  IDX_INDIRECT = 1,
  IDX_NO_COMMA = 2,
  IDX_POST_INC_DEC = 4,

  GRP_INVALID = 0, // cs.GRP_INVALID
  // Generic groups
  // all jump instructions (conditional+direct+indirect jumps)
  GRP_JUMP = 1, // cs.GRP_JUMP
  // all call instructions
  GRP_CALL = 3, // cs.GRP_CALL
  // all return instructions
  GRP_RET = 4, // cs.GRP_RET
  // all interrupt instructions (int+syscall)
  GRP_INT = 5, // cs.GRP_INT
  // all interrupt return instructions
  GRP_IRET = 6, // cs.GRP_IRET
  // all privileged instructions
  GRP_PRIV = 7, // cs.GRP_PRIVILEDGE; not used
  // all relative branching instructions
  GRP_BRAREL = 8, // cs.GRP_BRANCH_RELATIVE

  // Architecture-specific groups
  GRP_ENDING = 10, // mark the end of the list of groups

  // The first (register) operand is part of the
  // instruction mnemonic
  FIRST_OP_IN_MNEM = 1,
  // The second (register) operand is part of the
  // instruction mnemonic
  SECOND_OP_IN_MNEM = 2,

  // M680X instruction IDs
  INS_INVLD = 0,
  INS_ABA = 1, // M6800/1/2/3
  INS_ABX = 2,
  INS_ABY = 3,
  INS_ADC = 4,
  INS_ADCA = 5,
  INS_ADCB = 6,
  INS_ADCD = 7,
  INS_ADCR = 8,
  INS_ADD = 9,
  INS_ADDA = 10,
  INS_ADDB = 11,
  INS_ADDD = 12,
  INS_ADDE = 13,
  INS_ADDF = 14,
  INS_ADDR = 15,
  INS_ADDW = 16,
  INS_AIM = 17,
  INS_AIS = 18,
  INS_AIX = 19,
  INS_AND = 20,
  INS_ANDA = 21,
  INS_ANDB = 22,
  INS_ANDCC = 23,
  INS_ANDD = 24,
  INS_ANDR = 25,
  INS_ASL = 26,
  INS_ASLA = 27,
  INS_ASLB = 28,
  INS_ASLD = 29, // or LSLD
  INS_ASR = 30,
  INS_ASRA = 31,
  INS_ASRB = 32,
  INS_ASRD = 33,
  INS_ASRX = 34,
  INS_BAND = 35,
  INS_BCC = 36, // or BHS
  INS_BCLR = 37,
  INS_BCS = 38, // or BLO
  INS_BEOR = 39,
  INS_BEQ = 40,
  INS_BGE = 41,
  INS_BGND = 42,
  INS_BGT = 43,
  INS_BHCC = 44,
  INS_BHCS = 45,
  INS_BHI = 46,
  INS_BIAND = 47,
  INS_BIEOR = 48,
  INS_BIH = 49,
  INS_BIL = 50,
  INS_BIOR = 51,
  INS_BIT = 52,
  INS_BITA = 53,
  INS_BITB = 54,
  INS_BITD = 55,
  INS_BITMD = 56,
  INS_BLE = 57,
  INS_BLS = 58,
  INS_BLT = 59,
  INS_BMC = 60,
  INS_BMI = 61,
  INS_BMS = 62,
  INS_BNE = 63,
  INS_BOR = 64,
  INS_BPL = 65,
  INS_BRCLR = 66,
  INS_BRSET = 67,
  INS_BRA = 68,
  INS_BRN = 69,
  INS_BSET = 70,
  INS_BSR = 71,
  INS_BVC = 72,
  INS_BVS = 73,
  INS_CALL = 74,
  INS_CBA = 75, // M6800/1/2/3
  INS_CBEQ = 76,
  INS_CBEQA = 77,
  INS_CBEQX = 78,
  INS_CLC = 79, // M6800/1/2/3
  INS_CLI = 80, // M6800/1/2/3
  INS_CLR = 81,
  INS_CLRA = 82,
  INS_CLRB = 83,
  INS_CLRD = 84,
  INS_CLRE = 85,
  INS_CLRF = 86,
  INS_CLRH = 87,
  INS_CLRW = 88,
  INS_CLRX = 89,
  INS_CLV = 90, // M6800/1/2/3
  INS_CMP = 91,
  INS_CMPA = 92,
  INS_CMPB = 93,
  INS_CMPD = 94,
  INS_CMPE = 95,
  INS_CMPF = 96,
  INS_CMPR = 97,
  INS_CMPS = 98,
  INS_CMPU = 99,
  INS_CMPW = 100,
  INS_CMPX = 101,
  INS_CMPY = 102,
  INS_COM = 103,
  INS_COMA = 104,
  INS_COMB = 105,
  INS_COMD = 106,
  INS_COME = 107,
  INS_COMF = 108,
  INS_COMW = 109,
  INS_COMX = 110,
  INS_CPD = 111,
  INS_CPHX = 112,
  INS_CPS = 113,
  INS_CPX = 114, // M6800/1/2/3
  INS_CPY = 115,
  INS_CWAI = 116,
  INS_DAA = 117,
  INS_DBEQ = 118,
  INS_DBNE = 119,
  INS_DBNZ = 120,
  INS_DBNZA = 121,
  INS_DBNZX = 122,
  INS_DEC = 123,
  INS_DECA = 124,
  INS_DECB = 125,
  INS_DECD = 126,
  INS_DECE = 127,
  INS_DECF = 128,
  INS_DECW = 129,
  INS_DECX = 130,
  INS_DES = 131, // M6800/1/2/3
  INS_DEX = 132, // M6800/1/2/3
  INS_DEY = 133,
  INS_DIV = 134,
  INS_DIVD = 135,
  INS_DIVQ = 136,
  INS_EDIV = 137,
  INS_EDIVS = 138,
  INS_EIM = 139,
  INS_EMACS = 140,
  INS_EMAXD = 141,
  INS_EMAXM = 142,
  INS_EMIND = 143,
  INS_EMINM = 144,
  INS_EMUL = 145,
  INS_EMULS = 146,
  INS_EOR = 147,
  INS_EORA = 148,
  INS_EORB = 149,
  INS_EORD = 150,
  INS_EORR = 151,
  INS_ETBL = 152,
  INS_EXG = 153,
  INS_FDIV = 154,
  INS_IBEQ = 155,
  INS_IBNE = 156,
  INS_IDIV = 157,
  INS_IDIVS = 158,
  INS_ILLGL = 159,
  INS_INC = 160,
  INS_INCA = 161,
  INS_INCB = 162,
  INS_INCD = 163,
  INS_INCE = 164,
  INS_INCF = 165,
  INS_INCW = 166,
  INS_INCX = 167,
  INS_INS = 168, // M6800/1/2/3
  INS_INX = 169, // M6800/1/2/3
  INS_INY = 170,
  INS_JMP = 171,
  INS_JSR = 172,
  INS_LBCC = 173, // or LBHS
  INS_LBCS = 174, // or LBLO
  INS_LBEQ = 175,
  INS_LBGE = 176,
  INS_LBGT = 177,
  INS_LBHI = 178,
  INS_LBLE = 179,
  INS_LBLS = 180,
  INS_LBLT = 181,
  INS_LBMI = 182,
  INS_LBNE = 183,
  INS_LBPL = 184,
  INS_LBRA = 185,
  INS_LBRN = 186,
  INS_LBSR = 187,
  INS_LBVC = 188,
  INS_LBVS = 189,
  INS_LDA = 190,
  INS_LDAA = 191, // M6800/1/2/3
  INS_LDAB = 192, // M6800/1/2/3
  INS_LDB = 193,
  INS_LDBT = 194,
  INS_LDD = 195,
  INS_LDE = 196,
  INS_LDF = 197,
  INS_LDHX = 198,
  INS_LDMD = 199,
  INS_LDQ = 200,
  INS_LDS = 201,
  INS_LDU = 202,
  INS_LDW = 203,
  INS_LDX = 204,
  INS_LDY = 205,
  INS_LEAS = 206,
  INS_LEAU = 207,
  INS_LEAX = 208,
  INS_LEAY = 209,
  INS_LSL = 210,
  INS_LSLA = 211,
  INS_LSLB = 212,
  INS_LSLD = 213,
  INS_LSLX = 214,
  INS_LSR = 215,
  INS_LSRA = 216,
  INS_LSRB = 217,
  INS_LSRD = 218, // or ASRD
  INS_LSRW = 219,
  INS_LSRX = 220,
  INS_MAXA = 221,
  INS_MAXM = 222,
  INS_MEM = 223,
  INS_MINA = 224,
  INS_MINM = 225,
  INS_MOV = 226,
  INS_MOVB = 227,
  INS_MOVW = 228,
  INS_MUL = 229,
  INS_MULD = 230,
  INS_NEG = 231,
  INS_NEGA = 232,
  INS_NEGB = 233,
  INS_NEGD = 234,
  INS_NEGX = 235,
  INS_NOP = 236,
  INS_NSA = 237,
  INS_OIM = 238,
  INS_ORA = 239,
  INS_ORAA = 240, // M6800/1/2/3
  INS_ORAB = 241, // M6800/1/2/3
  INS_ORB = 242,
  INS_ORCC = 243,
  INS_ORD = 244,
  INS_ORR = 245,
  INS_PSHA = 246, // M6800/1/2/3
  INS_PSHB = 247, // M6800/1/2/3
  INS_PSHC = 248,
  INS_PSHD = 249,
  INS_PSHH = 250,
  INS_PSHS = 251,
  INS_PSHSW = 252,
  INS_PSHU = 253,
  INS_PSHUW = 254,
  INS_PSHX = 255, // M6800/1/2/3
  INS_PSHY = 256,
  INS_PULA = 257, // M6800/1/2/3
  INS_PULB = 258, // M6800/1/2/3
  INS_PULC = 259,
  INS_PULD = 260,
  INS_PULH = 261,
  INS_PULS = 262,
  INS_PULSW = 263,
  INS_PULU = 264,
  INS_PULUW = 265,
  INS_PULX = 266, // M6800/1/2/3
  INS_PULY = 267,
  INS_REV = 268,
  INS_REVW = 269,
  INS_ROL = 270,
  INS_ROLA = 271,
  INS_ROLB = 272,
  INS_ROLD = 273,
  INS_ROLW = 274,
  INS_ROLX = 275,
  INS_ROR = 276,
  INS_RORA = 277,
  INS_RORB = 278,
  INS_RORD = 279,
  INS_RORW = 280,
  INS_RORX = 281,
  INS_RSP = 282,
  INS_RTC = 283,
  INS_RTI = 284,
  INS_RTS = 285,
  INS_SBA = 286, // M6800/1/2/3
  INS_SBC = 287,
  INS_SBCA = 288,
  INS_SBCB = 289,
  INS_SBCD = 290,
  INS_SBCR = 291,
  INS_SEC = 292,
  INS_SEI = 293,
  INS_SEV = 294,
  INS_SEX = 295,
  INS_SEXW = 296,
  INS_SLP = 297,
  INS_STA = 298,
  INS_STAA = 299, // M6800/1/2/3
  INS_STAB = 300, // M6800/1/2/3
  INS_STB = 301,
  INS_STBT = 302,
  INS_STD = 303,
  INS_STE = 304,
  INS_STF = 305,
  INS_STOP = 306,
  INS_STHX = 307,
  INS_STQ = 308,
  INS_STS = 309,
  INS_STU = 310,
  INS_STW = 311,
  INS_STX = 312,
  INS_STY = 313,
  INS_SUB = 314,
  INS_SUBA = 315,
  INS_SUBB = 316,
  INS_SUBD = 317,
  INS_SUBE = 318,
  INS_SUBF = 319,
  INS_SUBR = 320,
  INS_SUBW = 321,
  INS_SWI = 322,
  INS_SWI2 = 323,
  INS_SWI3 = 324,
  INS_SYNC = 325,
  INS_TAB = 326, // M6800/1/2/3
  INS_TAP = 327, // M6800/1/2/3
  INS_TAX = 328,
  INS_TBA = 329, // M6800/1/2/3
  INS_TBEQ = 330,
  INS_TBL = 331,
  INS_TBNE = 332,
  INS_TEST = 333,
  INS_TFM = 334,
  INS_TFR = 335,
  INS_TIM = 336,
  INS_TPA = 337, // M6800/1/2/3
  INS_TST = 338,
  INS_TSTA = 339,
  INS_TSTB = 340,
  INS_TSTD = 341,
  INS_TSTE = 342,
  INS_TSTF = 343,
  INS_TSTW = 344,
  INS_TSTX = 345,
  INS_TSX = 346, // M6800/1/2/3
  INS_TSY = 347,
  INS_TXA = 348,
  INS_TXS = 349,
  INS_TYS = 350,
  INS_WAI = 351, // M6800/1/2/3
  INS_WAIT = 352,
  INS_WAV = 353,
  INS_WAVR = 354,
  INS_XGDX = 355, // M6800/1/2/3
  INS_XGDY = 356,
  INS_ENDING = 357, // mark the end of the list of instructions
}

export class cs_m680x {
  public flags: number; // See: M680X instruction flags
  public op_count: number; // number of operands for the instruction or 0
  public operands: cs_m680x_op[]; // operands for this insn.

  constructor(arch_info_ptr: number, Memory: any) {
    this.operands = [];
    this.flags = Memory.read(arch_info_ptr + 0, 'ubyte');
    this.op_count = Memory.read(arch_info_ptr + 1, 'ubyte');
    for (let i = 0; i < this.op_count; i++) {
      const op: cs_m680x_op = {} as cs_m680x_op;
      const op_ptr: number = arch_info_ptr + 4 + i * 24;
      op.type = Memory.read(op_ptr, 'i32');
      op.size = Memory.read(op_ptr + 20, 'ubyte');
      op.access = Memory.read(op_ptr + 21, 'ubyte');
      switch (op.type) {
        case M680X.OP_IMMEDIATE:
          op.imm = Memory.read(op_ptr + 4, 'i32');
          break;
        case M680X.OP_REGISTER:
          op.reg = Memory.read(op_ptr + 4, 'i32');
          break;
        case M680X.OP_INDEXED:
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
        case M680X.OP_RELATIVE:
          op.rel = {
            address: Memory.read(op_ptr + 4, 'ushort'),
            offset: Memory.read(op_ptr + 6, 'short'),
          };
          break;
        case M680X.OP_EXTENDED:
          op.ext = {
            address: Memory.read(op_ptr + 4, 'ushort'),
            indirect: Memory.read(op_ptr + 6, 'bool'),
          };
          break;
        case M680X.OP_DIRECT:
          op.direct_addr = Memory.read(op_ptr + 4, 'ubyte');
          break;
        case M680X.OP_CONSTANT:
          op.const_val = Memory.read(op_ptr + 4, 'ubyte');
          break;
      }
      this.operands[i] = op;
    }
    return this;
  }
}
