import { expect, test } from 'bun:test';
import cs from '../../capstone';

test('cs.ARCH_EVM', () => {
  const buffer = new Uint8Array([0x60, 0x61, 0x50]);

  const disassembler = new cs.Capstone(cs.ARCH_EVM, 0);
  disassembler.option(cs.OPT_DETAIL, true);
  const insns = disassembler.disasm(buffer, 0x1000);

  expect(
    insns.map(({ id, address, size, mnemonic, op_str, bytes }) => ({
      id,
      address,
      size,
      mnemonic,
      op_str,
      bytes,
    })),
  ).toEqual([
    {
      id: 96,
      address: 4096,
      size: 2,
      mnemonic: 'push1',
      op_str: '61',
      bytes: [96, 97],
    },
    {
      id: 80,
      address: 4098,
      size: 1,
      mnemonic: 'pop',
      op_str: '',
      bytes: [80],
    },
  ]);

  disassembler.close();
});
