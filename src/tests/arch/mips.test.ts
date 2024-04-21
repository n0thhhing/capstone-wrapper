import { expect, test } from 'bun:test';
import cs from '../../wrapper';

test('cs.ARCH_MIPS', () => {
  const buffer = new Uint8Array([
    0x0c, 0x10, 0x00, 0x97, 0x00, 0x00, 0x00, 0x00, 0x24, 0x02, 0x00, 0x0c,
    0x8f, 0xa2, 0x00, 0x00, 0x34, 0x21, 0x34, 0x56,
  ]);

  const disassembler = new cs.Capstone(
    cs.ARCH_MIPS,
    cs.MODE_MIPS32 | cs.MODE_BIG_ENDIAN,
  );
  const insns = disassembler.disasm(buffer, 0x1000);

  expect(insns).toEqual([
    {
      id: 337,
      address: 4096,
      size: 4,
      mnemonic: 'jal',
      op_str: '0x40025c',
      bytes: [12, 16, 0, 151],
    },
    {
      id: 622,
      address: 4100,
      size: 4,
      mnemonic: 'nop',
      op_str: '',
      bytes: [0, 0, 0, 0],
    },
    {
      id: 26,
      address: 4104,
      size: 4,
      mnemonic: 'addiu',
      op_str: '$v0, $zero, 0xc',
      bytes: [36, 2, 0, 12],
    },
    {
      id: 373,
      address: 4108,
      size: 4,
      mnemonic: 'lw',
      op_str: '$v0, ($sp)',
      bytes: [143, 162, 0, 0],
    },
    {
      id: 473,
      address: 4112,
      size: 4,
      mnemonic: 'ori',
      op_str: '$at, $at, 0x3456',
      bytes: [52, 33, 52, 86],
    },
  ]);

  disassembler.close();
});