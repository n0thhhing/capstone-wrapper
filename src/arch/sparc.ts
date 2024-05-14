export interface cs_sparc_op {
  type: SPARC; // operand type
  reg?: SPARC; // register value for REG operand
  imm?: number; // immediate value for IMM operand
  mem?: {
    // base/disp value for MEM operand
    base: number; // base register, can be safely interpreted as a value of type `sparc_reg`, but it is only one byte wide
    index: number; // index register, same conditions apply here
    disp: number; // displacement/offset value
  };
}

export enum SPARC {
  // Enums corresponding to Sparc condition codes, both icc's and fcc's.
  CC_INVALID = 0, // invalid CC (default)
  // Integer condition codes
  CC_ICC_A = 8 + 256, // Always
  CC_ICC_N = 0 + 256, // Never
  CC_ICC_NE = 9 + 256, // Not Equal
  CC_ICC_E = 1 + 256, // Equal
  CC_ICC_G = 10 + 256, // Greater
  CC_ICC_LE = 2 + 256, // Less or Equal
  CC_ICC_GE = 11 + 256, // Greater or Equal
  CC_ICC_L = 3 + 256, // Less
  CC_ICC_GU = 12 + 256, // Greater Unsigned
  CC_ICC_LEU = 4 + 256, // Less or Equal Unsigned
  CC_ICC_CC = 13 + 256, // Carry Clear/Great or Equal Unsigned
  CC_ICC_CS = 5 + 256, // Carry Set/Less Unsigned
  CC_ICC_POS = 14 + 256, // Positive
  CC_ICC_NEG = 6 + 256, // Negative
  CC_ICC_VC = 15 + 256, // Overflow Clear
  CC_ICC_VS = 7 + 256, // Overflow Set

  // Floating condition codes
  CC_FCC_A = 8 + 16 + 256, // Always
  CC_FCC_N = 0 + 16 + 256, // Never
  CC_FCC_U = 7 + 16 + 256, // Unordered
  CC_FCC_G = 6 + 16 + 256, // Greater
  CC_FCC_UG = 5 + 16 + 256, // Unordered or Greater
  CC_FCC_L = 4 + 16 + 256, // Less
  CC_FCC_UL = 3 + 16 + 256, // Unordered or Less
  CC_FCC_LG = 2 + 16 + 256, // Less or Greater
  CC_FCC_NE = 1 + 16 + 256, // Not Equal
  CC_FCC_E = 9 + 16 + 256, // Equal
  CC_FCC_UE = 10 + 16 + 256, // Unordered or Equal
  CC_FCC_GE = 11 + 16 + 256, // Greater or Equal
  CC_FCC_UGE = 12 + 16 + 256, // Unordered or Greater or Equal
  CC_FCC_LE = 13 + 16 + 256, // Less or Equal
  CC_FCC_ULE = 14 + 16 + 256, // Unordered or Less or Equal
  CC_FCC_O = 15 + 16 + 256, // Ordered

  // Branch hint
  HINT_INVALID = 0, // no hint
  HINT_A = 1 << 0, // annul delay slot instruction
  HINT_PT = 1 << 1, // branch taken
  HINT_PN = 1 << 2, // branch NOT taken

  // Operand type for instruction's operands
  OP_INVALID = 0, ///< = cs.OP_INVALID (Uninitialized).
  OP_REG = 1, ///< = cs.OP_REG (Register operand).
  OP_IMM = 2, ///< = cs.OP_IMM (Immediate operand).
  OP_MEM = 3, ///< = cs.OP_MEM (Memory operand).

  // SPARC registers
  REG_INVALID = 0,
  REG_F0 = 1,
  REG_F1 = 2,
  REG_F2 = 3,
  REG_F3 = 4,
  REG_F4 = 5,
  REG_F5 = 6,
  REG_F6 = 7,
  REG_F7 = 8,
  REG_F8 = 9,
  REG_F9 = 10,
  REG_F10 = 11,
  REG_F11 = 12,
  REG_F12 = 13,
  REG_F13 = 14,
  REG_F14 = 15,
  REG_F15 = 16,
  REG_F16 = 17,
  REG_F17 = 18,
  REG_F18 = 19,
  REG_F19 = 20,
  REG_F20 = 21,
  REG_F21 = 22,
  REG_F22 = 23,
  REG_F23 = 24,
  REG_F24 = 25,
  REG_F25 = 26,
  REG_F26 = 27,
  REG_F27 = 28,
  REG_F28 = 29,
  REG_F29 = 30,
  REG_F30 = 31,
  REG_F31 = 32,
  REG_F32 = 33,
  REG_F34 = 34,
  REG_F36 = 35,
  REG_F38 = 36,
  REG_F40 = 37,
  REG_F42 = 38,
  REG_F44 = 39,
  REG_F46 = 40,
  REG_F48 = 41,
  REG_F50 = 42,
  REG_F52 = 43,
  REG_F54 = 44,
  REG_F56 = 45,
  REG_F58 = 46,
  REG_F60 = 47,
  REG_F62 = 48,
  REG_FCC0 = 49,
  REG_FCC1 = 50,
  REG_FCC2 = 51,
  REG_FCC3 = 52,
  REG_FP = 53,
  REG_G0 = 54,
  REG_G1 = 55,
  REG_G2 = 56,
  REG_G3 = 57,
  REG_G4 = 58,
  REG_G5 = 59,
  REG_G6 = 60,
  REG_G7 = 61,
  REG_I0 = 62,
  REG_I1 = 63,
  REG_I2 = 64,
  REG_I3 = 65,
  REG_I4 = 66,
  REG_I5 = 67,
  REG_I7 = 68,
  REG_ICC = 69, // Integer condition codes
  REG_L0 = 70,
  REG_L1 = 71,
  REG_L2 = 72,
  REG_L3 = 73,
  REG_L4 = 74,
  REG_L5 = 75,
  REG_L6 = 76,
  REG_L7 = 77,
  REG_O0 = 78,
  REG_O1 = 79,
  REG_O2 = 80,
  REG_O3 = 81,
  REG_O4 = 82,
  REG_O5 = 83,
  REG_O7 = 84,
  REG_SP = 85,
  REG_Y = 86,

  // special register
  REG_XCC = 87,

  REG_ENDING = 88, // mark the end of the list of registers

  // extras
  REG_O6 = SPARC.REG_SP,
  REG_I6 = SPARC.REG_FP,

  // SPARC instruction
  INS_INVALID = 0,
  INS_ADDCC = 1,
  INS_ADDX = 2,
  INS_ADDXCC = 3,
  INS_ADDXC = 4,
  INS_ADDXCCC = 5,
  INS_ADD = 6,
  INS_ALIGNADDR = 7,
  INS_ALIGNADDRL = 8,
  INS_ANDCC = 9,
  INS_ANDNCC = 10,
  INS_ANDN = 11,
  INS_AND = 12,
  INS_ARRAY16 = 13,
  INS_ARRAY32 = 14,
  INS_ARRAY8 = 15,
  INS_B = 16,
  INS_JMP = 17,
  INS_BMASK = 18,
  INS_FB = 19,
  INS_BRGEZ = 20,
  INS_BRGZ = 21,
  INS_BRLEZ = 22,
  INS_BRLZ = 23,
  INS_BRNZ = 24,
  INS_BRZ = 25,
  INS_BSHUFFLE = 26,
  INS_CALL = 27,
  INS_CASX = 28,
  INS_CAS = 29,
  INS_CMASK16 = 30,
  INS_CMASK32 = 31,
  INS_CMASK8 = 32,
  INS_CMP = 33,
  INS_EDGE16 = 34,
  INS_EDGE16L = 35,
  INS_EDGE16LN = 36,
  INS_EDGE16N = 37,
  INS_EDGE32 = 38,
  INS_EDGE32L = 39,
  INS_EDGE32LN = 40,
  INS_EDGE32N = 41,
  INS_EDGE8 = 42,
  INS_EDGE8L = 43,
  INS_EDGE8LN = 44,
  INS_EDGE8N = 45,
  INS_FABSD = 46,
  INS_FABSQ = 47,
  INS_FABSS = 48,
  INS_FADDD = 49,
  INS_FADDQ = 50,
  INS_FADDS = 51,
  INS_FALIGNDATA = 52,
  INS_FAND = 53,
  INS_FANDNOT1 = 54,
  INS_FANDNOT1S = 55,
  INS_FANDNOT2 = 56,
  INS_FANDNOT2S = 57,
  INS_FANDS = 58,
  INS_FCHKSM16 = 59,
  INS_FCMPD = 60,
  INS_FCMPEQ16 = 61,
  INS_FCMPEQ32 = 62,
  INS_FCMPGT16 = 63,
  INS_FCMPGT32 = 64,
  INS_FCMPLE16 = 65,
  INS_FCMPLE32 = 66,
  INS_FCMPNE16 = 67,
  INS_FCMPNE32 = 68,
  INS_FCMPQ = 69,
  INS_FCMPS = 70,
  INS_FDIVD = 71,
  INS_FDIVQ = 72,
  INS_FDIVS = 73,
  INS_FDMULQ = 74,
  INS_FDTOI = 75,
  INS_FDTOQ = 76,
  INS_FDTOS = 77,
  INS_FDTOX = 78,
  INS_FEXPAND = 79,
  INS_FHADDD = 80,
  INS_FHADDS = 81,
  INS_FHSUBD = 82,
  INS_FHSUBS = 83,
  INS_FITOD = 84,
  INS_FITOQ = 85,
  INS_FITOS = 86,
  INS_FLCMPD = 87,
  INS_FLCMPS = 88,
  INS_FLUSHW = 89,
  INS_FMEAN16 = 90,
  INS_FMOVD = 91,
  INS_FMOVQ = 92,
  INS_FMOVRDGEZ = 93,
  INS_FMOVRQGEZ = 94,
  INS_FMOVRSGEZ = 95,
  INS_FMOVRDGZ = 96,
  INS_FMOVRQGZ = 97,
  INS_FMOVRSGZ = 98,
  INS_FMOVRDLEZ = 99,
  INS_FMOVRQLEZ = 100,
  INS_FMOVRSLEZ = 101,
  INS_FMOVRDLZ = 102,
  INS_FMOVRQLZ = 103,
  INS_FMOVRSLZ = 104,
  INS_FMOVRDNZ = 105,
  INS_FMOVRQNZ = 106,
  INS_FMOVRSNZ = 107,
  INS_FMOVRDZ = 108,
  INS_FMOVRQZ = 109,
  INS_FMOVRSZ = 110,
  INS_FMOVS = 111,
  INS_FMUL8SUX16 = 112,
  INS_FMUL8ULX16 = 113,
  INS_FMUL8X16 = 114,
  INS_FMUL8X16AL = 115,
  INS_FMUL8X16AU = 116,
  INS_FMULD = 117,
  INS_FMULD8SUX16 = 118,
  INS_FMULD8ULX16 = 119,
  INS_FMULQ = 120,
  INS_FMULS = 121,
  INS_FNADDD = 122,
  INS_FNADDS = 123,
  INS_FNAND = 124,
  INS_FNANDS = 125,
  INS_FNEGD = 126,
  INS_FNEGQ = 127,
  INS_FNEGS = 128,
  INS_FNHADDD = 129,
  INS_FNHADDS = 130,
  INS_FNOR = 131,
  INS_FNORS = 132,
  INS_FNOT1 = 133,
  INS_FNOT1S = 134,
  INS_FNOT2 = 135,
  INS_FNOT2S = 136,
  INS_FONE = 137,
  INS_FONES = 138,
  INS_FOR = 139,
  INS_FORNOT1 = 140,
  INS_FORNOT1S = 141,
  INS_FORNOT2 = 142,
  INS_FORNOT2S = 143,
  INS_FORS = 144,
  INS_FPACK16 = 145,
  INS_FPACK32 = 146,
  INS_FPACKFIX = 147,
  INS_FPADD16 = 148,
  INS_FPADD16S = 149,
  INS_FPADD32 = 150,
  INS_FPADD32S = 151,
  INS_FPADD64 = 152,
  INS_FPMERGE = 153,
  INS_FPSUB16 = 154,
  INS_FPSUB16S = 155,
  INS_FPSUB32 = 156,
  INS_FPSUB32S = 157,
  INS_FQTOD = 158,
  INS_FQTOI = 159,
  INS_FQTOS = 160,
  INS_FQTOX = 161,
  INS_FSLAS16 = 162,
  INS_FSLAS32 = 163,
  INS_FSLL16 = 164,
  INS_FSLL32 = 165,
  INS_FSMULD = 166,
  INS_FSQRTD = 167,
  INS_FSQRTQ = 168,
  INS_FSQRTS = 169,
  INS_FSRA16 = 170,
  INS_FSRA32 = 171,
  INS_FSRC1 = 172,
  INS_FSRC1S = 173,
  INS_FSRC2 = 174,
  INS_FSRC2S = 175,
  INS_FSRL16 = 176,
  INS_FSRL32 = 177,
  INS_FSTOD = 178,
  INS_FSTOI = 179,
  INS_FSTOQ = 180,
  INS_FSTOX = 181,
  INS_FSUBD = 182,
  INS_FSUBQ = 183,
  INS_FSUBS = 184,
  INS_FXNOR = 185,
  INS_FXNORS = 186,
  INS_FXOR = 187,
  INS_FXORS = 188,
  INS_FXTOD = 189,
  INS_FXTOQ = 190,
  INS_FXTOS = 191,
  INS_FZERO = 192,
  INS_FZEROS = 193,
  INS_JMPL = 194,
  INS_LDD = 195,
  INS_LD = 196,
  INS_LDQ = 197,
  INS_LDSB = 198,
  INS_LDSH = 199,
  INS_LDSW = 200,
  INS_LDUB = 201,
  INS_LDUH = 202,
  INS_LDX = 203,
  INS_LZCNT = 204,
  INS_MEMBAR = 205,
  INS_MOVDTOX = 206,
  INS_MOV = 207,
  INS_MOVRGEZ = 208,
  INS_MOVRGZ = 209,
  INS_MOVRLEZ = 210,
  INS_MOVRLZ = 211,
  INS_MOVRNZ = 212,
  INS_MOVRZ = 213,
  INS_MOVSTOSW = 214,
  INS_MOVSTOUW = 215,
  INS_MULX = 216,
  INS_NOP = 217,
  INS_ORCC = 218,
  INS_ORNCC = 219,
  INS_ORN = 220,
  INS_OR = 221,
  INS_PDIST = 222,
  INS_PDISTN = 223,
  INS_POPC = 224,
  INS_RD = 225,
  INS_RESTORE = 226,
  INS_RETT = 227,
  INS_SAVE = 228,
  INS_SDIVCC = 229,
  INS_SDIVX = 230,
  INS_SDIV = 231,
  INS_SETHI = 232,
  INS_SHUTDOWN = 233,
  INS_SIAM = 234,
  INS_SLLX = 235,
  INS_SLL = 236,
  INS_SMULCC = 237,
  INS_SMUL = 238,
  INS_SRAX = 239,
  INS_SRA = 240,
  INS_SRLX = 241,
  INS_SRL = 242,
  INS_STBAR = 243,
  INS_STB = 244,
  INS_STD = 245,
  INS_ST = 246,
  INS_STH = 247,
  INS_STQ = 248,
  INS_STX = 249,
  INS_SUBCC = 250,
  INS_SUBX = 251,
  INS_SUBXCC = 252,
  INS_SUB = 253,
  INS_SWAP = 254,
  INS_TADDCCTV = 255,
  INS_TADDCC = 256,
  INS_T = 257,
  INS_TSUBCCTV = 258,
  INS_TSUBCC = 259,
  INS_UDIVCC = 260,
  INS_UDIVX = 261,
  INS_UDIV = 262,
  INS_UMULCC = 263,
  INS_UMULXHI = 264,
  INS_UMUL = 265,
  INS_UNIMP = 266,
  INS_FCMPED = 267,
  INS_FCMPEQ = 268,
  INS_FCMPES = 269,
  INS_WR = 270,
  INS_XMULX = 271,
  INS_XMULXHI = 272,
  INS_XNORCC = 273,
  INS_XNOR = 274,
  INS_XORCC = 275,
  INS_XOR = 276,

  // alias instructions
  INS_RET = 277,
  INS_RETL = 278,

  INS_ENDING = 279, // mark the end of the list of instructions

  // Group of SPARC instructions
  GRP_INVALID = 0, // cs.GRP_INVALID

  // Generic groups
  // all jump instructions (conditional+direct+indirect jumps)
  GRP_JUMP = 1, // cs.GRP_JUMP

  // Architecture-specific groups
  GRP_HARDQUAD = 128,
  GRP_V9 = 129,
  GRP_VIS = 130,
  GRP_VIS2 = 131,
  GRP_VIS3 = 132,
  GRP_32BIT = 133,
  GRP_64BIT = 134,
  GRP_ENDING = 135, // mark the end of the list of groups
}

export class cs_sparc {
  public cc: SPARC;
  public hint: SPARC;
  public op_count: number;
  public operands: cs_sparc_op[];

  constructor(arch_info_ptr: number, Memory: any) {
    this.operands = [];
    this.cc = Memory.read(arch_info_ptr + 0, 'i32');
    this.hint = Memory.read(arch_info_ptr + 4, 'i32');
    this.op_count = Memory.read(arch_info_ptr + 8, 'ubyte');
    for (let i = 0; i < this.op_count; i++) {
      const op: cs_sparc_op = {} as cs_sparc_op;
      const op_ptr: number = arch_info_ptr + 16 + i * 16;
      op.type = Memory.read(op_ptr + 0, 'i32');
      switch (op.type) {
        case SPARC.OP_REG:
          op.reg = Memory.read(op_ptr + 8, 'i32');
          break;
        case SPARC.OP_IMM:
          op.imm = Memory.read(op_ptr + 8, 'long');
          break;
        case SPARC.OP_MEM:
          op.mem = {
            base: Memory.read(op_ptr + 8, 'ubyte'),
            index: Memory.read(op_ptr + 9, 'ubyte'),
            disp: Memory.read(op_ptr + 12, 'i32'),
          };
          break;
      }
      this.operands[i] = op;
    }
    return this;
  }
}
