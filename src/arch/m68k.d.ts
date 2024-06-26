export interface cs_m68k_op {
  imm?: number;
  dimm?: number;
  simm?: number;
  reg?: M68K;
  reg_pair?: {
    reg_0: M68K;
    reg_1: M68K;
  };
  mem?: {
    base_reg: M68K;
    index_reg: M68K;
    in_base_reg: M68K;
    in_disp: number;
    out_disp: number;
    disp: number;
    scale: number;
    bitfield: number;
    width: number;
    offset: number;
    index_size: number;
  };
  br_disp?: {
    disp: number;
    disp_size: number;
  };
  register_bits?: number;
  type: M68K;
  address_mode: M68K;
}
export declare enum M68K {
  OPERAND_COUNT = 4,
  REG_INVALID = 0,
  REG_D0 = 1,
  REG_D1 = 2,
  REG_D2 = 3,
  REG_D3 = 4,
  REG_D4 = 5,
  REG_D5 = 6,
  REG_D6 = 7,
  REG_D7 = 8,
  REG_A0 = 9,
  REG_A1 = 10,
  REG_A2 = 11,
  REG_A3 = 12,
  REG_A4 = 13,
  REG_A5 = 14,
  REG_A6 = 15,
  REG_A7 = 16,
  REG_FP0 = 17,
  REG_FP1 = 18,
  REG_FP2 = 19,
  REG_FP3 = 20,
  REG_FP4 = 21,
  REG_FP5 = 22,
  REG_FP6 = 23,
  REG_FP7 = 24,
  REG_PC = 25,
  REG_SR = 26,
  REG_CCR = 27,
  REG_SFC = 28,
  REG_DFC = 29,
  REG_USP = 30,
  REG_VBR = 31,
  REG_CACR = 32,
  REG_CAAR = 33,
  REG_MSP = 34,
  REG_ISP = 35,
  REG_TC = 36,
  REG_ITT0 = 37,
  REG_ITT1 = 38,
  REG_DTT0 = 39,
  REG_DTT1 = 40,
  REG_MMUSR = 41,
  REG_URP = 42,
  REG_SRP = 43,
  REG_FPCR = 44,
  REG_FPSR = 45,
  REG_FPIAR = 46,
  REG_ENDING = 47, // mark the end of the list of registers
  AM_NONE = 0, // No address mode.
  AM_REG_DIRECT_DATA = 1, // Register Direct - Data
  AM_REG_DIRECT_ADDR = 2, // Register Direct - Address
  AM_REGI_ADDR = 3, // Register Indirect - Address
  AM_REGI_ADDR_POST_INC = 4, // Register Indirect - Address with Postincrement
  AM_REGI_ADDR_PRE_DEC = 5, // Register Indirect - Address with Predecrement
  AM_REGI_ADDR_DISP = 6, // Register Indirect - Address with Displacement
  AM_AREGI_INDEX_8_BIT_DISP = 7, // Address Register Indirect With Index- 8-bit displacement
  AM_AREGI_INDEX_BASE_DISP = 8, // Address Register Indirect With Index- Base displacement
  AM_MEMI_POST_INDEX = 9, // Memory indirect - Postindex
  AM_MEMI_PRE_INDEX = 10, // Memory indirect - Preindex
  AM_PCI_DISP = 11, // Program Counter Indirect - with Displacement
  AM_PCI_INDEX_8_BIT_DISP = 12, // Program Counter Indirect with Index - with 8-Bit Displacement
  AM_PCI_INDEX_BASE_DISP = 13, // Program Counter Indirect with Index - with Base Displacement
  AM_PC_MEMI_POST_INDEX = 14, // Program Counter Memory Indirect - Postindexed
  AM_PC_MEMI_PRE_INDEX = 15, // Program Counter Memory Indirect - Preindexed
  AM_ABSOLUTE_DATA_SHORT = 16, // Absolute Data Addressing  - Short
  AM_ABSOLUTE_DATA_LONG = 17, // Absolute Data Addressing  - Long
  AM_IMMEDIATE = 18, // Immediate value
  AM_BRANCH_DISPLACEMENT = 19, // Address as displacement from (PC+2) used by branches
  OP_INVALID = 0, // = CS_OP_INVALID (Uninitialized).
  OP_REG = 1, // = CS_OP_REG (Register operand).
  OP_IMM = 2, // = CS_OP_IMM (Immediate operand).
  OP_MEM = 3, // = CS_OP_MEM (Memory operand).
  OP_FP_SINGLE = 4, // single precision Floating-Point operand
  OP_FP_DOUBLE = 5, // double precision Floating-Point operand
  OP_REG_BITS = 6, // Register bits move
  OP_REG_PAIR = 7, // Register pair in the same op (upper 4 bits for first reg, lower for second)
  OP_BR_DISP = 8, // Branch displacement
  OP_BR_DISP_SIZE_INVALID = 0, // = CS_OP_INVALID (Uninitialized).
  OP_BR_DISP_SIZE_BYTE = 1, // signed 8-bit displacement
  OP_BR_DISP_SIZE_WORD = 2, // signed 16-bit displacement
  OP_BR_DISP_SIZE_LONG = 4, // signed 32-bit displacement
  CPU_SIZE_NONE = 0, // unsized or unspecified
  CPU_SIZE_BYTE = 1, // 1 byte in size
  CPU_SIZE_WORD = 2, // 2 bytes in size
  CPU_SIZE_LONG = 4, // 4 bytes in size
  FPU_SIZE_NONE = 0, // unsized like fsave/frestore
  FPU_SIZE_SINGLE = 4, // 4 byte in size (single float)
  FPU_SIZE_DOUBLE = 8, // 8 byte in size (double)
  FPU_SIZE_EXTENDED = 12, // 12 byte in size (extended real format)
  SIZE_TYPE_INVALID = 0,
  SIZE_TYPE_CPU = 1,
  SIZE_TYPE_FPU = 2,
  INS_INVALID = 0,
  INS_ABCD = 1,
  INS_ADD = 2,
  INS_ADDA = 3,
  INS_ADDI = 4,
  INS_ADDQ = 5,
  INS_ADDX = 6,
  INS_AND = 7,
  INS_ANDI = 8,
  INS_ASL = 9,
  INS_ASR = 10,
  INS_BHS = 11,
  INS_BLO = 12,
  INS_BHI = 13,
  INS_BLS = 14,
  INS_BCC = 15,
  INS_BCS = 16,
  INS_BNE = 17,
  INS_BEQ = 18,
  INS_BVC = 19,
  INS_BVS = 20,
  INS_BPL = 21,
  INS_BMI = 22,
  INS_BGE = 23,
  INS_BLT = 24,
  INS_BGT = 25,
  INS_BLE = 26,
  INS_BRA = 27,
  INS_BSR = 28,
  INS_BCHG = 29,
  INS_BCLR = 30,
  INS_BSET = 31,
  INS_BTST = 32,
  INS_BFCHG = 33,
  INS_BFCLR = 34,
  INS_BFEXTS = 35,
  INS_BFEXTU = 36,
  INS_BFFFO = 37,
  INS_BFINS = 38,
  INS_BFSET = 39,
  INS_BFTST = 40,
  INS_BKPT = 41,
  INS_CALLM = 42,
  INS_CAS = 43,
  INS_CAS2 = 44,
  INS_CHK = 45,
  INS_CHK2 = 46,
  INS_CLR = 47,
  INS_CMP = 48,
  INS_CMPA = 49,
  INS_CMPI = 50,
  INS_CMPM = 51,
  INS_CMP2 = 52,
  INS_CINVL = 53,
  INS_CINVP = 54,
  INS_CINVA = 55,
  INS_CPUSHL = 56,
  INS_CPUSHP = 57,
  INS_CPUSHA = 58,
  INS_DBT = 59,
  INS_DBF = 60,
  INS_DBHI = 61,
  INS_DBLS = 62,
  INS_DBCC = 63,
  INS_DBCS = 64,
  INS_DBNE = 65,
  INS_DBEQ = 66,
  INS_DBVC = 67,
  INS_DBVS = 68,
  INS_DBPL = 69,
  INS_DBMI = 70,
  INS_DBGE = 71,
  INS_DBLT = 72,
  INS_DBGT = 73,
  INS_DBLE = 74,
  INS_DBRA = 75,
  INS_DIVS = 76,
  INS_DIVSL = 77,
  INS_DIVU = 78,
  INS_DIVUL = 79,
  INS_EOR = 80,
  INS_EORI = 81,
  INS_EXG = 82,
  INS_EXT = 83,
  INS_EXTB = 84,
  INS_FABS = 85,
  INS_FSABS = 86,
  INS_FDABS = 87,
  INS_FACOS = 88,
  INS_FADD = 89,
  INS_FSADD = 90,
  INS_FDADD = 91,
  INS_FASIN = 92,
  INS_FATAN = 93,
  INS_FATANH = 94,
  INS_FBF = 95,
  INS_FBEQ = 96,
  INS_FBOGT = 97,
  INS_FBOGE = 98,
  INS_FBOLT = 99,
  INS_FBOLE = 100,
  INS_FBOGL = 101,
  INS_FBOR = 102,
  INS_FBUN = 103,
  INS_FBUEQ = 104,
  INS_FBUGT = 105,
  INS_FBUGE = 106,
  INS_FBULT = 107,
  INS_FBULE = 108,
  INS_FBNE = 109,
  INS_FBT = 110,
  INS_FBSF = 111,
  INS_FBSEQ = 112,
  INS_FBGT = 113,
  INS_FBGE = 114,
  INS_FBLT = 115,
  INS_FBLE = 116,
  INS_FBGL = 117,
  INS_FBGLE = 118,
  INS_FBNGLE = 119,
  INS_FBNGL = 120,
  INS_FBNLE = 121,
  INS_FBNLT = 122,
  INS_FBNGE = 123,
  INS_FBNGT = 124,
  INS_FBSNE = 125,
  INS_FBST = 126,
  INS_FCMP = 127,
  INS_FCOS = 128,
  INS_FCOSH = 129,
  INS_FDBF = 130,
  INS_FDBEQ = 131,
  INS_FDBOGT = 132,
  INS_FDBOGE = 133,
  INS_FDBOLT = 134,
  INS_FDBOLE = 135,
  INS_FDBOGL = 136,
  INS_FDBOR = 137,
  INS_FDBUN = 138,
  INS_FDBUEQ = 139,
  INS_FDBUGT = 140,
  INS_FDBUGE = 141,
  INS_FDBULT = 142,
  INS_FDBULE = 143,
  INS_FDBNE = 144,
  INS_FDBT = 145,
  INS_FDBSF = 146,
  INS_FDBSEQ = 147,
  INS_FDBGT = 148,
  INS_FDBGE = 149,
  INS_FDBLT = 150,
  INS_FDBLE = 151,
  INS_FDBGL = 152,
  INS_FDBGLE = 153,
  INS_FDBNGLE = 154,
  INS_FDBNGL = 155,
  INS_FDBNLE = 156,
  INS_FDBNLT = 157,
  INS_FDBNGE = 158,
  INS_FDBNGT = 159,
  INS_FDBSNE = 160,
  INS_FDBST = 161,
  INS_FDIV = 162,
  INS_FSDIV = 163,
  INS_FDDIV = 164,
  INS_FETOX = 165,
  INS_FETOXM1 = 166,
  INS_FGETEXP = 167,
  INS_FGETMAN = 168,
  INS_FINT = 169,
  INS_FINTRZ = 170,
  INS_FLOG10 = 171,
  INS_FLOG2 = 172,
  INS_FLOGN = 173,
  INS_FLOGNP1 = 174,
  INS_FMOD = 175,
  INS_FMOVE = 176,
  INS_FSMOVE = 177,
  INS_FDMOVE = 178,
  INS_FMOVECR = 179,
  INS_FMOVEM = 180,
  INS_FMUL = 181,
  INS_FSMUL = 182,
  INS_FDMUL = 183,
  INS_FNEG = 184,
  INS_FSNEG = 185,
  INS_FDNEG = 186,
  INS_FNOP = 187,
  INS_FREM = 188,
  INS_FRESTORE = 189,
  INS_FSAVE = 190,
  INS_FSCALE = 191,
  INS_FSGLDIV = 192,
  INS_FSGLMUL = 193,
  INS_FSIN = 194,
  INS_FSINCOS = 195,
  INS_FSINH = 196,
  INS_FSQRT = 197,
  INS_FSSQRT = 198,
  INS_FDSQRT = 199,
  INS_FSF = 200,
  INS_FSBEQ = 201,
  INS_FSOGT = 202,
  INS_FSOGE = 203,
  INS_FSOLT = 204,
  INS_FSOLE = 205,
  INS_FSOGL = 206,
  INS_FSOR = 207,
  INS_FSUN = 208,
  INS_FSUEQ = 209,
  INS_FSUGT = 210,
  INS_FSUGE = 211,
  INS_FSULT = 212,
  INS_FSULE = 213,
  INS_FSNE = 214,
  INS_FST = 215,
  INS_FSSF = 216,
  INS_FSSEQ = 217,
  INS_FSGT = 218,
  INS_FSGE = 219,
  INS_FSLT = 220,
  INS_FSLE = 221,
  INS_FSGL = 222,
  INS_FSGLE = 223,
  INS_FSNGLE = 224,
  INS_FSNGL = 225,
  INS_FSNLE = 226,
  INS_FSNLT = 227,
  INS_FSNGE = 228,
  INS_FSNGT = 229,
  INS_FSSNE = 230,
  INS_FSST = 231,
  INS_FSUB = 232,
  INS_FSSUB = 233,
  INS_FDSUB = 234,
  INS_FTAN = 235,
  INS_FTANH = 236,
  INS_FTENTOX = 237,
  INS_FTRAPF = 238,
  INS_FTRAPEQ = 239,
  INS_FTRAPOGT = 240,
  INS_FTRAPOGE = 241,
  INS_FTRAPOLT = 242,
  INS_FTRAPOLE = 243,
  INS_FTRAPOGL = 244,
  INS_FTRAPOR = 245,
  INS_FTRAPUN = 246,
  INS_FTRAPUEQ = 247,
  INS_FTRAPUGT = 248,
  INS_FTRAPUGE = 249,
  INS_FTRAPULT = 250,
  INS_FTRAPULE = 251,
  INS_FTRAPNE = 252,
  INS_FTRAPT = 253,
  INS_FTRAPSF = 254,
  INS_FTRAPSEQ = 255,
  INS_FTRAPGT = 256,
  INS_FTRAPGE = 257,
  INS_FTRAPLT = 258,
  INS_FTRAPLE = 259,
  INS_FTRAPGL = 260,
  INS_FTRAPGLE = 261,
  INS_FTRAPNGLE = 262,
  INS_FTRAPNGL = 263,
  INS_FTRAPNLE = 264,
  INS_FTRAPNLT = 265,
  INS_FTRAPNGE = 266,
  INS_FTRAPNGT = 267,
  INS_FTRAPSNE = 268,
  INS_FTRAPST = 269,
  INS_FTST = 270,
  INS_FTWOTOX = 271,
  INS_HALT = 272,
  INS_ILLEGAL = 273,
  INS_JMP = 274,
  INS_JSR = 275,
  INS_LEA = 276,
  INS_LINK = 277,
  INS_LPSTOP = 278,
  INS_LSL = 279,
  INS_LSR = 280,
  INS_MOVE = 281,
  INS_MOVEA = 282,
  INS_MOVEC = 283,
  INS_MOVEM = 284,
  INS_MOVEP = 285,
  INS_MOVEQ = 286,
  INS_MOVES = 287,
  INS_MOVE16 = 288,
  INS_MULS = 289,
  INS_MULU = 290,
  INS_NBCD = 291,
  INS_NEG = 292,
  INS_NEGX = 293,
  INS_NOP = 294,
  INS_NOT = 295,
  INS_OR = 296,
  INS_ORI = 297,
  INS_PACK = 298,
  INS_PEA = 299,
  INS_PFLUSH = 300,
  INS_PFLUSHA = 301,
  INS_PFLUSHAN = 302,
  INS_PFLUSHN = 303,
  INS_PLOADR = 304,
  INS_PLOADW = 305,
  INS_PLPAR = 306,
  INS_PLPAW = 307,
  INS_PMOVE = 308,
  INS_PMOVEFD = 309,
  INS_PTESTR = 310,
  INS_PTESTW = 311,
  INS_PULSE = 312,
  INS_REMS = 313,
  INS_REMU = 314,
  INS_RESET = 315,
  INS_ROL = 316,
  INS_ROR = 317,
  INS_ROXL = 318,
  INS_ROXR = 319,
  INS_RTD = 320,
  INS_RTE = 321,
  INS_RTM = 322,
  INS_RTR = 323,
  INS_RTS = 324,
  INS_SBCD = 325,
  INS_ST = 326,
  INS_SF = 327,
  INS_SHI = 328,
  INS_SLS = 329,
  INS_SCC = 330,
  INS_SHS = 331,
  INS_SCS = 332,
  INS_SLO = 333,
  INS_SNE = 334,
  INS_SEQ = 335,
  INS_SVC = 336,
  INS_SVS = 337,
  INS_SPL = 338,
  INS_SMI = 339,
  INS_SGE = 340,
  INS_SLT = 341,
  INS_SGT = 342,
  INS_SLE = 343,
  INS_STOP = 344,
  INS_SUB = 345,
  INS_SUBA = 346,
  INS_SUBI = 347,
  INS_SUBQ = 348,
  INS_SUBX = 349,
  INS_SWAP = 350,
  INS_TAS = 351,
  INS_TRAP = 352,
  INS_TRAPV = 353,
  INS_TRAPT = 354,
  INS_TRAPF = 355,
  INS_TRAPHI = 356,
  INS_TRAPLS = 357,
  INS_TRAPCC = 358,
  INS_TRAPHS = 359,
  INS_TRAPCS = 360,
  INS_TRAPLO = 361,
  INS_TRAPNE = 362,
  INS_TRAPEQ = 363,
  INS_TRAPVC = 364,
  INS_TRAPVS = 365,
  INS_TRAPPL = 366,
  INS_TRAPMI = 367,
  INS_TRAPGE = 368,
  INS_TRAPLT = 369,
  INS_TRAPGT = 370,
  INS_TRAPLE = 371,
  INS_TST = 372,
  INS_UNLK = 373,
  INS_UNPK = 374,
  INS_ENDING = 375, // mark the end of the list of instructions
  GRP_INVALID = 0, // CS_GRUP_INVALID
  GRP_JUMP = 1, // CS_GRP_JUMP
  GRP_RET = 3, // CS_GRP_RET
  GRP_IRET = 5, // CS_GRP_IRET
  GRP_BRANCH_RELATIVE = 7, // CS_GRP_BRANCH_RELATIVE
  GRP_ENDING = 8,
}
export declare class cs_m68k {
  operands: cs_m68k_op[];
  op_size: {
    type: M68K;
    cpu_size?: M68K;
    fpu_size?: M68K;
  };
  op_count: number;
  constructor(arch_info_ptr: number, Memory: any);
}
