import { expect, test } from 'bun:test';
import cs from '../../wrapper';

test('cs.ARCH_PPC', () => {
  const buffer = new Uint8Array([
    0x10, 0x00, 0x1f, 0xec, 0xe0, 0x6d, 0x80, 0x04, 0xe4, 0x6d, 0x80, 0x04,
    0x10, 0x60, 0x1c, 0x4c, 0x10, 0x60, 0x1c, 0x0c, 0xf0, 0x6d, 0x80, 0x04,
    0xf4, 0x6d, 0x80, 0x04, 0x10, 0x60, 0x1c, 0x4e, 0x10, 0x60, 0x1c, 0x0e,
    0x10, 0x60, 0x1a, 0x10, 0x10, 0x60, 0x1a, 0x11, 0x10, 0x63, 0x20, 0x2a,
    0x10, 0x63, 0x20, 0x2b, 0x10, 0x83, 0x20, 0x40, 0x10, 0x83, 0x20, 0xc0,
    0x10, 0x83, 0x20, 0x00, 0x10, 0x83, 0x20, 0x80, 0x10, 0x63, 0x20, 0x24,
    0x10, 0x63, 0x20, 0x25, 0x10, 0x63, 0x29, 0x3a, 0x10, 0x63, 0x29, 0x3b,
    0x10, 0x63, 0x29, 0x1c, 0x10, 0x63, 0x29, 0x1d, 0x10, 0x63, 0x29, 0x1e,
    0x10, 0x63, 0x29, 0x1f, 0x10, 0x63, 0x24, 0x20, 0x10, 0x63, 0x24, 0x21,
    0x10, 0x63, 0x24, 0x60, 0x10, 0x63, 0x24, 0x61, 0x10, 0x63, 0x24, 0xa0,
    0x10, 0x63, 0x24, 0xa1, 0x10, 0x63, 0x24, 0xe0, 0x10, 0x63, 0x24, 0xe1,
    0x10, 0x60, 0x20, 0x90, 0x10, 0x60, 0x20, 0x91, 0x10, 0x63, 0x29, 0x38,
    0x10, 0x63, 0x29, 0x39, 0x10, 0x63, 0x01, 0x32, 0x10, 0x63, 0x01, 0x33,
    0x10, 0x63, 0x01, 0x18, 0x10, 0x63, 0x01, 0x19, 0x10, 0x63, 0x01, 0x1a,
    0x10, 0x63, 0x01, 0x1b, 0x10, 0x60, 0x19, 0x10, 0x10, 0x60, 0x19, 0x11,
    0x10, 0x60, 0x18, 0x50, 0x10, 0x60, 0x18, 0x51, 0x10, 0x63, 0x29, 0x3e,
    0x10, 0x63, 0x29, 0x3f, 0x10, 0x63, 0x29, 0x3c, 0x10, 0x63, 0x29, 0x3d,
    0x10, 0x60, 0x18, 0x30, 0x10, 0x60, 0x18, 0x31, 0x10, 0x60, 0x18, 0x34,
    0x10, 0x60, 0x18, 0x35, 0x10, 0x63, 0x29, 0x2e, 0x10, 0x63, 0x29, 0x2f,
    0x10, 0x63, 0x20, 0x28, 0x10, 0x63, 0x20, 0x29, 0x10, 0x63, 0x29, 0x14,
    0x10, 0x63, 0x29, 0x15, 0x10, 0x63, 0x29, 0x16, 0x10, 0x63, 0x29, 0x17,
  ]);

  const disassembler = new cs.Capstone(
    cs.ARCH_PPC,
    cs.MODE_BIG_ENDIAN + cs.MODE_PS,
  );
  const insns = disassembler.disasm(buffer, 0x1000);

  expect(insns).toEqual([
    {
      id: 1689,
      address: 4096,
      size: 4,
      mnemonic: 'dcbz_l',
      op_str: 'r0, r3',
      bytes: [16, 0, 31, 236],
    },
    {
      id: 1690,
      address: 4100,
      size: 4,
      mnemonic: 'psq_l',
      op_str: 'f3, 4(r13), 1, 0',
      bytes: [224, 109, 128, 4],
    },
    {
      id: 1691,
      address: 4104,
      size: 4,
      mnemonic: 'psq_lu',
      op_str: 'f3, 4(r13), 1, 0',
      bytes: [228, 109, 128, 4],
    },
    {
      id: 1692,
      address: 4108,
      size: 4,
      mnemonic: 'psq_lux',
      op_str: 'f3, r0, r3, 1, 0',
      bytes: [16, 96, 28, 76],
    },
    {
      id: 1693,
      address: 4112,
      size: 4,
      mnemonic: 'psq_lx',
      op_str: 'f3, r0, r3, 1, 0',
      bytes: [16, 96, 28, 12],
    },
    {
      id: 1694,
      address: 4116,
      size: 4,
      mnemonic: 'psq_st',
      op_str: 'f3, 4(r13), 1, 0',
      bytes: [240, 109, 128, 4],
    },
    {
      id: 1695,
      address: 4120,
      size: 4,
      mnemonic: 'psq_stu',
      op_str: 'f3, 4(r13), 1, 0',
      bytes: [244, 109, 128, 4],
    },
    {
      id: 1696,
      address: 4124,
      size: 4,
      mnemonic: 'psq_stux',
      op_str: 'f3, r0, r3, 1, 0',
      bytes: [16, 96, 28, 78],
    },
    {
      id: 1697,
      address: 4128,
      size: 4,
      mnemonic: 'psq_stx',
      op_str: 'f3, r0, r3, 1, 0',
      bytes: [16, 96, 28, 14],
    },
    {
      id: 1698,
      address: 4132,
      size: 4,
      mnemonic: 'ps_abs',
      op_str: 'f3, f3',
      bytes: [16, 96, 26, 16],
    },
    {
      id: 1698,
      address: 4136,
      size: 4,
      mnemonic: 'ps_abs.',
      op_str: 'f3, f3',
      bytes: [16, 96, 26, 17],
    },
    {
      id: 1699,
      address: 4140,
      size: 4,
      mnemonic: 'ps_add',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 32, 42],
    },
    {
      id: 1699,
      address: 4144,
      size: 4,
      mnemonic: 'ps_add.',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 32, 43],
    },
    {
      id: 1700,
      address: 4148,
      size: 4,
      mnemonic: 'ps_cmpo0',
      op_str: 'cr1, f3, f4',
      bytes: [16, 131, 32, 64],
    },
    {
      id: 1701,
      address: 4152,
      size: 4,
      mnemonic: 'ps_cmpo1',
      op_str: 'cr1, f3, f4',
      bytes: [16, 131, 32, 192],
    },
    {
      id: 1702,
      address: 4156,
      size: 4,
      mnemonic: 'ps_cmpu0',
      op_str: 'cr1, f3, f4',
      bytes: [16, 131, 32, 0],
    },
    {
      id: 1703,
      address: 4160,
      size: 4,
      mnemonic: 'ps_cmpu1',
      op_str: 'cr1, f3, f4',
      bytes: [16, 131, 32, 128],
    },
    {
      id: 1704,
      address: 4164,
      size: 4,
      mnemonic: 'ps_div',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 32, 36],
    },
    {
      id: 1704,
      address: 4168,
      size: 4,
      mnemonic: 'ps_div.',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 32, 37],
    },
    {
      id: 1705,
      address: 4172,
      size: 4,
      mnemonic: 'ps_madd',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 58],
    },
    {
      id: 1705,
      address: 4176,
      size: 4,
      mnemonic: 'ps_madd.',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 59],
    },
    {
      id: 1706,
      address: 4180,
      size: 4,
      mnemonic: 'ps_madds0',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 28],
    },
    {
      id: 1706,
      address: 4184,
      size: 4,
      mnemonic: 'ps_madds0.',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 29],
    },
    {
      id: 1707,
      address: 4188,
      size: 4,
      mnemonic: 'ps_madds1',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 30],
    },
    {
      id: 1707,
      address: 4192,
      size: 4,
      mnemonic: 'ps_madds1.',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 31],
    },
    {
      id: 1708,
      address: 4196,
      size: 4,
      mnemonic: 'ps_merge00',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 36, 32],
    },
    {
      id: 1708,
      address: 4200,
      size: 4,
      mnemonic: 'ps_merge00.',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 36, 33],
    },
    {
      id: 1709,
      address: 4204,
      size: 4,
      mnemonic: 'ps_merge01',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 36, 96],
    },
    {
      id: 1709,
      address: 4208,
      size: 4,
      mnemonic: 'ps_merge01.',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 36, 97],
    },
    {
      id: 1710,
      address: 4212,
      size: 4,
      mnemonic: 'ps_merge10',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 36, 160],
    },
    {
      id: 1710,
      address: 4216,
      size: 4,
      mnemonic: 'ps_merge10.',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 36, 161],
    },
    {
      id: 1711,
      address: 4220,
      size: 4,
      mnemonic: 'ps_merge11',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 36, 224],
    },
    {
      id: 1711,
      address: 4224,
      size: 4,
      mnemonic: 'ps_merge11.',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 36, 225],
    },
    {
      id: 1712,
      address: 4228,
      size: 4,
      mnemonic: 'ps_mr',
      op_str: 'f3, f4',
      bytes: [16, 96, 32, 144],
    },
    {
      id: 1712,
      address: 4232,
      size: 4,
      mnemonic: 'ps_mr.',
      op_str: 'f3, f4',
      bytes: [16, 96, 32, 145],
    },
    {
      id: 1713,
      address: 4236,
      size: 4,
      mnemonic: 'ps_msub',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 56],
    },
    {
      id: 1713,
      address: 4240,
      size: 4,
      mnemonic: 'ps_msub.',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 57],
    },
    {
      id: 1714,
      address: 4244,
      size: 4,
      mnemonic: 'ps_mul',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 1, 50],
    },
    {
      id: 1714,
      address: 4248,
      size: 4,
      mnemonic: 'ps_mul.',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 1, 51],
    },
    {
      id: 1715,
      address: 4252,
      size: 4,
      mnemonic: 'ps_muls0',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 1, 24],
    },
    {
      id: 1715,
      address: 4256,
      size: 4,
      mnemonic: 'ps_muls0.',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 1, 25],
    },
    {
      id: 1716,
      address: 4260,
      size: 4,
      mnemonic: 'ps_muls1',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 1, 26],
    },
    {
      id: 1716,
      address: 4264,
      size: 4,
      mnemonic: 'ps_muls1.',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 1, 27],
    },
    {
      id: 1717,
      address: 4268,
      size: 4,
      mnemonic: 'ps_nabs',
      op_str: 'f3, f3',
      bytes: [16, 96, 25, 16],
    },
    {
      id: 1717,
      address: 4272,
      size: 4,
      mnemonic: 'ps_nabs.',
      op_str: 'f3, f3',
      bytes: [16, 96, 25, 17],
    },
    {
      id: 1718,
      address: 4276,
      size: 4,
      mnemonic: 'ps_neg',
      op_str: 'f3, f3',
      bytes: [16, 96, 24, 80],
    },
    {
      id: 1718,
      address: 4280,
      size: 4,
      mnemonic: 'ps_neg.',
      op_str: 'f3, f3',
      bytes: [16, 96, 24, 81],
    },
    {
      id: 1719,
      address: 4284,
      size: 4,
      mnemonic: 'ps_nmadd',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 62],
    },
    {
      id: 1719,
      address: 4288,
      size: 4,
      mnemonic: 'ps_nmadd.',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 63],
    },
    {
      id: 1720,
      address: 4292,
      size: 4,
      mnemonic: 'ps_nmsub',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 60],
    },
    {
      id: 1720,
      address: 4296,
      size: 4,
      mnemonic: 'ps_nmsub.',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 61],
    },
    {
      id: 1721,
      address: 4300,
      size: 4,
      mnemonic: 'ps_res',
      op_str: 'f3, f3',
      bytes: [16, 96, 24, 48],
    },
    {
      id: 1721,
      address: 4304,
      size: 4,
      mnemonic: 'ps_res.',
      op_str: 'f3, f3',
      bytes: [16, 96, 24, 49],
    },
    {
      id: 1722,
      address: 4308,
      size: 4,
      mnemonic: 'ps_rsqrte',
      op_str: 'f3, f3',
      bytes: [16, 96, 24, 52],
    },
    {
      id: 1722,
      address: 4312,
      size: 4,
      mnemonic: 'ps_rsqrte.',
      op_str: 'f3, f3',
      bytes: [16, 96, 24, 53],
    },
    {
      id: 1723,
      address: 4316,
      size: 4,
      mnemonic: 'ps_sel',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 46],
    },
    {
      id: 1723,
      address: 4320,
      size: 4,
      mnemonic: 'ps_sel.',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 47],
    },
    {
      id: 1724,
      address: 4324,
      size: 4,
      mnemonic: 'ps_sub',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 32, 40],
    },
    {
      id: 1724,
      address: 4328,
      size: 4,
      mnemonic: 'ps_sub.',
      op_str: 'f3, f3, f4',
      bytes: [16, 99, 32, 41],
    },
    {
      id: 1725,
      address: 4332,
      size: 4,
      mnemonic: 'ps_sum0',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 20],
    },
    {
      id: 1725,
      address: 4336,
      size: 4,
      mnemonic: 'ps_sum0.',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 21],
    },
    {
      id: 1726,
      address: 4340,
      size: 4,
      mnemonic: 'ps_sum1',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 22],
    },
    {
      id: 1726,
      address: 4344,
      size: 4,
      mnemonic: 'ps_sum1.',
      op_str: 'f3, f3, f4, f5',
      bytes: [16, 99, 41, 23],
    },
  ]);

  disassembler.close();
});
