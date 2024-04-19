import { expect, test } from 'bun:test';
import cs from '../../wrapper';

test('cs.ARCH_MOS65XX', () => {
  const buffer = new Uint8Array([
    0x07, 0x12, 0x27, 0x12, 0x47, 0x12, 0x67, 0x12, 0x87, 0x12, 0xa7, 0x12,
    0xc7, 0x12, 0xe7, 0x12, 0x10, 0xfe, 0x0f, 0x12, 0xfd, 0x4f, 0x12, 0xfd,
    0x8f, 0x12, 0xfd, 0xcf, 0x12, 0xfd,
  ]);
  const disassembler = new cs.Capstone(cs.ARCH_MOS65XX, cs.MODE_MOS65XX_W65C02);
  const insns = disassembler.disasm(buffer, 0x1000);

  expect(insns).toEqual([
    {
      id: 62,
      address: 4096,
      size: 2,
      mnemonic: 'rmb0',
      op_str: '0x12',
      bytes: [7, 18],
    },
    {
      id: 62,
      address: 4098,
      size: 2,
      mnemonic: 'rmb2',
      op_str: '0x12',
      bytes: [39, 18],
    },
    {
      id: 62,
      address: 4100,
      size: 2,
      mnemonic: 'rmb4',
      op_str: '0x12',
      bytes: [71, 18],
    },
    {
      id: 62,
      address: 4102,
      size: 2,
      mnemonic: 'rmb6',
      op_str: '0x12',
      bytes: [103, 18],
    },
    {
      id: 73,
      address: 4104,
      size: 2,
      mnemonic: 'smb0',
      op_str: '0x12',
      bytes: [135, 18],
    },
    {
      id: 73,
      address: 4106,
      size: 2,
      mnemonic: 'smb2',
      op_str: '0x12',
      bytes: [167, 18],
    },
    {
      id: 73,
      address: 4108,
      size: 2,
      mnemonic: 'smb4',
      op_str: '0x12',
      bytes: [199, 18],
    },
    {
      id: 73,
      address: 4110,
      size: 2,
      mnemonic: 'smb6',
      op_str: '0x12',
      bytes: [231, 18],
    },
    {
      id: 12,
      address: 4112,
      size: 2,
      mnemonic: 'bpl',
      op_str: '0x0000', // '0x1010',
      bytes: [16, 254],
    },
    {
      id: 4,
      address: 4114,
      size: 3,
      mnemonic: 'bbr0',
      op_str: '0x00, 0000', // '0x12, 0x1012',
      bytes: [15, 18, 253],
    },
    {
      id: 4,
      address: 4117,
      size: 3,
      mnemonic: 'bbr4',
      op_str: '0x00, 0000', // '0x12, 0x1015',
      bytes: [79, 18, 253],
    },
    {
      id: 5,
      address: 4120,
      size: 3,
      mnemonic: 'bbs0',
      op_str: '0x00, 0000', //'0x12, 0x1018',
      bytes: [143, 18, 253],
    },
    {
      id: 5,
      address: 4123,
      size: 3,
      mnemonic: 'bbs4',
      op_str: '0x00, 0000', // '0x12, 0x101b',
      bytes: [207, 18, 253],
    },
  ]);

  disassembler.close();
});
