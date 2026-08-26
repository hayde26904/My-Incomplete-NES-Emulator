
--I love reimplementing half my emulator in lua for a debug script

addrModeInfo = {
    ["IMPLICIT"] = {
        size = 1,
        memory = false
    },

    ["IMMEDIATE"] = {
        size = 2,
        memory = false
    },

    ["ZEROPAGE"] = {
        size = 2,
        memory = true
    },

    ["ZEROPAGE_X"] = {
        size = 2,
        memory = true
    },

    ["ZEROPAGE_Y"] = {
        size = 2,
        memory = true
    },

    ["ABSOLUTE"] = {
        size = 3,
        memory = true
    },

    ["ABSOLUTE_X"] = {
        size = 3,
        memory = true
    },

    ["ABSOLUTE_Y"] = {
        size = 3,
        memory = true
    },

    ["ACCUMULATOR"] = {
        size = 1,
        memory = false
    },

    ["RELATIVE"] = {
        size = 2,
        memory = false
    },

    ["INDIRECT"] = {
        size = 3,
        memory = true
    },

    ["INDIRECT_X"] = {
        size = 2,
        memory = true
    },

    ["INDIRECT_Y"] = {
        size = 2,
        memory = true
    }
}

opcodeAddrModes = {
    [0x00] = "IMPLICIT",

    [0xA9] = "IMMEDIATE",
    [0xA5] = "ZEROPAGE",
    [0xB5] = "ZEROPAGE_X",
    [0xAD] = "ABSOLUTE",
    [0xBD] = "ABSOLUTE_X",
    [0xB9] = "ABSOLUTE_Y",
    [0xA1] = "INDIRECT_X",
    [0xB1] = "INDIRECT_Y",

    [0x85] = "ZEROPAGE",
    [0x95] = "ZEROPAGE_X",
    [0x8D] = "ABSOLUTE",
    [0x9D] = "ABSOLUTE_X",
    [0x99] = "ABSOLUTE_Y",
    [0x81] = "INDIRECT_X",
    [0x91] = "INDIRECT_Y",

    [0xA2] = "IMMEDIATE",
    [0xA6] = "ZEROPAGE",
    [0xB6] = "ZEROPAGE_Y",
    [0xAE] = "ABSOLUTE",
    [0xBE] = "ABSOLUTE_Y",

    [0x86] = "ZEROPAGE",
    [0x96] = "ZEROPAGE_Y",
    [0x8E] = "ABSOLUTE",

    [0xA0] = "IMMEDIATE",
    [0xA4] = "ZEROPAGE",
    [0xB4] = "ZEROPAGE_X",
    [0xAC] = "ABSOLUTE",
    [0xBC] = "ABSOLUTE_X",

    [0x84] = "ZEROPAGE",
    [0x94] = "ZEROPAGE_X",
    [0x8C] = "ABSOLUTE",

    [0xAA] = "IMPLICIT",
    [0x8A] = "IMPLICIT",
    [0xA8] = "IMPLICIT",
    [0x98] = "IMPLICIT",
    [0xBA] = "IMPLICIT",
    [0x9A] = "IMPLICIT",

    [0x4C] = "ABSOLUTE",
    [0x6C] = "INDIRECT",

    [0x20] = "ABSOLUTE",
    [0x60] = "IMPLICIT",
    [0x40] = "IMPLICIT",

    [0xE6] = "ZEROPAGE",
    [0xF6] = "ZEROPAGE_X",
    [0xEE] = "ABSOLUTE",
    [0xFE] = "ABSOLUTE_X",

    [0xC6] = "ZEROPAGE",
    [0xD6] = "ZEROPAGE_X",
    [0xCE] = "ABSOLUTE",
    [0xDE] = "ABSOLUTE_X",

    [0xE8] = "IMPLICIT",
    [0xCA] = "IMPLICIT",
    [0xC8] = "IMPLICIT",
    [0x88] = "IMPLICIT",

    [0x38] = "IMPLICIT",
    [0x18] = "IMPLICIT",

    [0x69] = "IMMEDIATE",
    [0x65] = "ZEROPAGE",
    [0x75] = "ZEROPAGE_X",
    [0x6D] = "ABSOLUTE",
    [0x7D] = "ABSOLUTE_X",
    [0x79] = "ABSOLUTE_Y",
    [0x61] = "INDIRECT_X",
    [0x71] = "INDIRECT_Y",

    [0xE9] = "IMMEDIATE",
    [0xE5] = "ZEROPAGE",
    [0xF5] = "ZEROPAGE_X",
    [0xED] = "ABSOLUTE",
    [0xFD] = "ABSOLUTE_X",
    [0xF9] = "ABSOLUTE_Y",
    [0xE1] = "INDIRECT_X",
    [0xF1] = "INDIRECT_Y",

    [0xC9] = "IMMEDIATE",
    [0xC5] = "ZEROPAGE",
    [0xD5] = "ZEROPAGE_X",
    [0xCD] = "ABSOLUTE",
    [0xDD] = "ABSOLUTE_X",
    [0xD9] = "ABSOLUTE_Y",
    [0xC1] = "INDIRECT_X",
    [0xD1] = "INDIRECT_Y",

    [0xE0] = "IMMEDIATE",
    [0xE4] = "ZEROPAGE",
    [0xEC] = "ABSOLUTE",

    [0xC0] = "IMMEDIATE",
    [0xC4] = "ZEROPAGE",
    [0xCC] = "ABSOLUTE",

    [0x24] = "ZEROPAGE",
    [0x2C] = "ABSOLUTE",

    [0xF0] = "RELATIVE",
    [0xD0] = "RELATIVE",
    [0x90] = "RELATIVE",
    [0xB0] = "RELATIVE",
    [0x30] = "RELATIVE",
    [0x10] = "RELATIVE",

    [0x29] = "IMMEDIATE",
    [0x25] = "ZEROPAGE",
    [0x35] = "ZEROPAGE_X",
    [0x2D] = "ABSOLUTE",
    [0x3D] = "ABSOLUTE_X",
    [0x39] = "ABSOLUTE_Y",
    [0x21] = "INDIRECT_X",
    [0x31] = "INDIRECT_Y",

    [0x09] = "IMMEDIATE",
    [0x05] = "ZEROPAGE",
    [0x15] = "ZEROPAGE_X",
    [0x0D] = "ABSOLUTE",
    [0x1D] = "ABSOLUTE_X",
    [0x19] = "ABSOLUTE_Y",
    [0x01] = "INDIRECT_X",
    [0x11] = "INDIRECT_Y",

    [0x49] = "IMMEDIATE",
    [0x45] = "ZEROPAGE",
    [0x55] = "ZEROPAGE_X",
    [0x4D] = "ABSOLUTE",
    [0x5D] = "ABSOLUTE_X",
    [0x59] = "ABSOLUTE_Y",
    [0x41] = "INDIRECT_X",
    [0x51] = "INDIRECT_Y",

    [0x48] = "IMPLICIT",
    [0x68] = "IMPLICIT",
    [0x08] = "IMPLICIT",
    [0x28] = "IMPLICIT",

    [0x0A] = "ACCUMULATOR",
    [0x06] = "ZEROPAGE",
    [0x16] = "ZEROPAGE_X",
    [0x0E] = "ABSOLUTE",
    [0x1E] = "ABSOLUTE_X",

    [0x4A] = "ACCUMULATOR",
    [0x46] = "ZEROPAGE",
    [0x56] = "ZEROPAGE_X",
    [0x4E] = "ABSOLUTE",
    [0x5E] = "ABSOLUTE_X",

    [0x6A] = "ACCUMULATOR",
    [0x66] = "ZEROPAGE",
    [0x76] = "ZEROPAGE_X",
    [0x6E] = "ABSOLUTE",
    [0x7E] = "ABSOLUTE_X",

    [0x2A] = "ACCUMULATOR",
    [0x26] = "ZEROPAGE",
    [0x36] = "ZEROPAGE_X",
    [0x2E] = "ABSOLUTE",
    [0x3E] = "ABSOLUTE_X",
}


opNames = {
    [0x00]="BRK", [0x01]="ORA", [0x02]="KIL", [0x03]="SLO",
    [0x04]="NOP", [0x05]="ORA", [0x06]="ASL", [0x07]="SLO",
    [0x08]="PHP", [0x09]="ORA", [0x0A]="ASL", [0x0B]="ANC",
    [0x0C]="NOP", [0x0D]="ORA", [0x0E]="ASL", [0x0F]="SLO",

    [0x10]="BPL", [0x11]="ORA", [0x12]="KIL", [0x13]="SLO",
    [0x14]="NOP", [0x15]="ORA", [0x16]="ASL", [0x17]="SLO",
    [0x18]="CLC", [0x19]="ORA", [0x1A]="NOP", [0x1B]="SLO",
    [0x1C]="NOP", [0x1D]="ORA", [0x1E]="ASL", [0x1F]="SLO",

    [0x20]="JSR", [0x21]="AND", [0x22]="KIL", [0x23]="RLA",
    [0x24]="BIT", [0x25]="AND", [0x26]="ROL", [0x27]="RLA",
    [0x28]="PLP", [0x29]="AND", [0x2A]="ROL", [0x2B]="ANC",
    [0x2C]="BIT", [0x2D]="AND", [0x2E]="ROL", [0x2F]="RLA",

    [0x30]="BMI", [0x31]="AND", [0x32]="KIL", [0x33]="RLA",
    [0x34]="NOP", [0x35]="AND", [0x36]="ROL", [0x37]="RLA",
    [0x38]="SEC", [0x39]="AND", [0x3A]="NOP", [0x3B]="RLA",
    [0x3C]="NOP", [0x3D]="AND", [0x3E]="ROL", [0x3F]="RLA",

    [0x40]="RTI", [0x41]="EOR", [0x42]="KIL", [0x43]="SRE",
    [0x44]="NOP", [0x45]="EOR", [0x46]="LSR", [0x47]="SRE",
    [0x48]="PHA", [0x49]="EOR", [0x4A]="LSR", [0x4B]="ALR",
    [0x4C]="JMP", [0x4D]="EOR", [0x4E]="LSR", [0x4F]="SRE",

    [0x50]="BVC", [0x51]="EOR", [0x52]="KIL", [0x53]="SRE",
    [0x54]="NOP", [0x55]="EOR", [0x56]="LSR", [0x57]="SRE",
    [0x58]="CLI", [0x59]="EOR", [0x5A]="NOP", [0x5B]="SRE",
    [0x5C]="NOP", [0x5D]="EOR", [0x5E]="LSR", [0x5F]="SRE",

    [0x60]="RTS", [0x61]="ADC", [0x62]="KIL", [0x63]="RRA",
    [0x64]="NOP", [0x65]="ADC", [0x66]="ROR", [0x67]="RRA",
    [0x68]="PLA", [0x69]="ADC", [0x6A]="ROR", [0x6B]="ARR",
    [0x6C]="JMP", [0x6D]="ADC", [0x6E]="ROR", [0x6F]="RRA",

    [0x70]="BVS", [0x71]="ADC", [0x72]="KIL", [0x73]="RRA",
    [0x74]="NOP", [0x75]="ADC", [0x76]="ROR", [0x77]="RRA",
    [0x78]="SEI", [0x79]="ADC", [0x7A]="NOP", [0x7B]="RRA",
    [0x7C]="NOP", [0x7D]="ADC", [0x7E]="ROR", [0x7F]="RRA",

    [0x80]="NOP", [0x81]="STA", [0x82]="NOP", [0x83]="SAX",
    [0x84]="STY", [0x85]="STA", [0x86]="STX", [0x87]="SAX",
    [0x88]="DEY", [0x89]="NOP", [0x8A]="TXA", [0x8B]="XAA",
    [0x8C]="STY", [0x8D]="STA", [0x8E]="STX", [0x8F]="SAX",

    [0x90]="BCC", [0x91]="STA", [0x92]="KIL", [0x93]="AHX",
    [0x94]="STY", [0x95]="STA", [0x96]="STX", [0x97]="SAX",
    [0x98]="TYA", [0x99]="STA", [0x9A]="TXS", [0x9B]="TAS",
    [0x9C]="SHY", [0x9D]="STA", [0x9E]="SHX", [0x9F]="AHX",

    [0xA0]="LDY", [0xA1]="LDA", [0xA2]="LDX", [0xA3]="LAX",
    [0xA4]="LDY", [0xA5]="LDA", [0xA6]="LDX", [0xA7]="LAX",
    [0xA8]="TAY", [0xA9]="LDA", [0xAA]="TAX", [0xAB]="LAX",
    [0xAC]="LDY", [0xAD]="LDA", [0xAE]="LDX", [0xAF]="LAX",

    [0xB0]="BCS", [0xB1]="LDA", [0xB2]="KIL", [0xB3]="LAX",
    [0xB4]="LDY", [0xB5]="LDA", [0xB6]="LDX", [0xB7]="LAX",
    [0xB8]="CLV", [0xB9]="LDA", [0xBA]="TSX", [0xBB]="LAS",
    [0xBC]="LDY", [0xBD]="LDA", [0xBE]="LDX", [0xBF]="LAX",

    [0xC0]="CPY", [0xC1]="CMP", [0xC2]="NOP", [0xC3]="DCP",
    [0xC4]="CPY", [0xC5]="CMP", [0xC6]="DEC", [0xC7]="DCP",
    [0xC8]="INY", [0xC9]="CMP", [0xCA]="DEX", [0xCB]="AXS",
    [0xCC]="CPY", [0xCD]="CMP", [0xCE]="DEC", [0xCF]="DCP",

    [0xD0]="BNE", [0xD1]="CMP", [0xD2]="KIL", [0xD3]="DCP",
    [0xD4]="NOP", [0xD5]="CMP", [0xD6]="DEC", [0xD7]="DCP",
    [0xD8]="CLD", [0xD9]="CMP", [0xDA]="NOP", [0xDB]="DCP",
    [0xDC]="NOP", [0xDD]="CMP", [0xDE]="DEC", [0xDF]="DCP",

    [0xE0]="CPX", [0xE1]="SBC", [0xE2]="NOP", [0xE3]="ISC",
    [0xE4]="CPX", [0xE5]="SBC", [0xE6]="INC", [0xE7]="ISC",
    [0xE8]="INX", [0xE9]="SBC", [0xEA]="NOP", [0xEB]="SBC",
    [0xEC]="CPX", [0xED]="SBC", [0xEE]="INC", [0xEF]="ISC",

    [0xF0]="BEQ", [0xF1]="SBC", [0xF2]="KIL", [0xF3]="ISC",
    [0xF4]="NOP", [0xF5]="SBC", [0xF6]="INC", [0xF7]="ISC",
    [0xF8]="SED", [0xF9]="SBC", [0xFA]="NOP", [0xFB]="ISC",
    [0xFC]="NOP", [0xFD]="SBC", [0xFE]="INC", [0xFF]="ISC"
}

opcodeAddrModes = {
    [0x00]="IMPLICIT",      [0x01]="INDIRECT_X",    [0x02]="IMMEDIATE",    [0x03]="INDIRECT_X",
    [0x04]="ZEROPAGE",     [0x05]="ZEROPAGE",      [0x06]="ZEROPAGE",      [0x07]="ZEROPAGE",
    [0x08]="IMPLICIT",      [0x09]="IMMEDIATE",     [0x0A]="ACCUMULATOR",   [0x0B]="IMMEDIATE",
    [0x0C]="ABSOLUTE",     [0x0D]="ABSOLUTE",      [0x0E]="ABSOLUTE",      [0x0F]="ABSOLUTE",

    [0x10]="RELATIVE",     [0x11]="INDIRECT_Y",    [0x12]="INDIRECT_Y",    [0x13]="INDIRECT_Y",
    [0x14]="ZEROPAGE_X",   [0x15]="ZEROPAGE_X",    [0x16]="ZEROPAGE_X",    [0x17]="ZEROPAGE_X",
    [0x18]="IMPLICIT",     [0x19]="ABSOLUTE_Y",    [0x1A]="IMPLICIT",       [0x1B]="ABSOLUTE_Y",
    [0x1C]="ABSOLUTE_X",   [0x1D]="ABSOLUTE_X",    [0x1E]="ABSOLUTE_X",    [0x1F]="ABSOLUTE_X",

    [0x20]="ABSOLUTE",     [0x21]="INDIRECT_X",    [0x22]="IMMEDIATE",     [0x23]="INDIRECT_X",
    [0x24]="ZEROPAGE",     [0x25]="ZEROPAGE",      [0x26]="ZEROPAGE",      [0x27]="ZEROPAGE",
    [0x28]="IMPLICIT",     [0x29]="IMMEDIATE",     [0x2A]="ACCUMULATOR",   [0x2B]="IMMEDIATE",
    [0x2C]="ABSOLUTE",     [0x2D]="ABSOLUTE",      [0x2E]="ABSOLUTE",      [0x2F]="ABSOLUTE",

    [0x30]="RELATIVE",     [0x31]="INDIRECT_Y",    [0x32]="INDIRECT_Y",    [0x33]="INDIRECT_Y",
    [0x34]="ZEROPAGE_X",   [0x35]="ZEROPAGE_X",    [0x36]="ZEROPAGE_X",    [0x37]="ZEROPAGE_X",
    [0x38]="IMPLICIT",     [0x39]="ABSOLUTE_Y",    [0x3A]="IMPLICIT",       [0x3B]="ABSOLUTE_Y",
    [0x3C]="ABSOLUTE_X",   [0x3D]="ABSOLUTE_X",    [0x3E]="ABSOLUTE_X",    [0x3F]="ABSOLUTE_X",

    [0x40]="IMPLICIT",     [0x41]="INDIRECT_X",    [0x42]="IMMEDIATE",     [0x43]="INDIRECT_X",
    [0x44]="ZEROPAGE",     [0x45]="ZEROPAGE",      [0x46]="ZEROPAGE",      [0x47]="ZEROPAGE",
    [0x48]="IMPLICIT",     [0x49]="IMMEDIATE",     [0x4A]="ACCUMULATOR",   [0x4B]="IMMEDIATE",
    [0x4C]="ABSOLUTE",     [0x4D]="ABSOLUTE",      [0x4E]="ABSOLUTE",      [0x4F]="ABSOLUTE",

    [0x50]="RELATIVE",     [0x51]="INDIRECT_Y",    [0x52]="INDIRECT_Y",    [0x53]="INDIRECT_Y",
    [0x54]="ZEROPAGE_X",   [0x55]="ZEROPAGE_X",    [0x56]="ZEROPAGE_X",    [0x57]="ZEROPAGE_X",
    [0x58]="IMPLICIT",     [0x59]="ABSOLUTE_Y",    [0x5A]="IMPLICIT",       [0x5B]="ABSOLUTE_Y",
    [0x5C]="ABSOLUTE_X",   [0x5D]="ABSOLUTE_X",    [0x5E]="ABSOLUTE_X",    [0x5F]="ABSOLUTE_X",

    [0x60]="IMPLICIT",     [0x61]="INDIRECT_X",    [0x62]="IMMEDIATE",     [0x63]="INDIRECT_X",
    [0x64]="ZEROPAGE",     [0x65]="ZEROPAGE",      [0x66]="ZEROPAGE",      [0x67]="ZEROPAGE",
    [0x68]="IMPLICIT",     [0x69]="IMMEDIATE",     [0x6A]="ACCUMULATOR",   [0x6B]="IMMEDIATE",
    [0x6C]="INDIRECT",     [0x6D]="ABSOLUTE",      [0x6E]="ABSOLUTE",      [0x6F]="ABSOLUTE",

    [0x70]="RELATIVE",     [0x71]="INDIRECT_Y",    [0x72]="INDIRECT_Y",    [0x73]="INDIRECT_Y",
    [0x74]="ZEROPAGE_X",   [0x75]="ZEROPAGE_X",    [0x76]="ZEROPAGE_X",    [0x77]="ZEROPAGE_X",
    [0x78]="IMPLICIT",     [0x79]="ABSOLUTE_Y",    [0x7A]="IMPLICIT",       [0x7B]="ABSOLUTE_Y",
    [0x7C]="ABSOLUTE_X",   [0x7D]="ABSOLUTE_X",    [0x7E]="ABSOLUTE_X",    [0x7F]="ABSOLUTE_X",

    [0x80]="IMMEDIATE",    [0x81]="INDIRECT_X",    [0x82]="IMMEDIATE",     [0x83]="INDIRECT_X",
    [0x84]="ZEROPAGE",     [0x85]="ZEROPAGE",      [0x86]="ZEROPAGE",      [0x87]="ZEROPAGE",
    [0x88]="IMPLICIT",     [0x89]="IMMEDIATE",     [0x8A]="IMPLICIT",       [0x8B]="IMMEDIATE",
    [0x8C]="ABSOLUTE",     [0x8D]="ABSOLUTE",      [0x8E]="ABSOLUTE",      [0x8F]="ABSOLUTE",

    [0x90]="RELATIVE",     [0x91]="INDIRECT_Y",    [0x92]="INDIRECT_Y",    [0x93]="INDIRECT_Y",
    [0x94]="ZEROPAGE_X",   [0x95]="ZEROPAGE_X",    [0x96]="ZEROPAGE_Y",    [0x97]="ZEROPAGE_Y",
    [0x98]="IMPLICIT",     [0x99]="ABSOLUTE_Y",    [0x9A]="IMPLICIT",       [0x9B]="ABSOLUTE_Y",
    [0x9C]="ABSOLUTE_X",   [0x9D]="ABSOLUTE_X",    [0x9E]="ABSOLUTE_Y",    [0x9F]="ABSOLUTE_Y",

    [0xA0]="IMMEDIATE",    [0xA1]="INDIRECT_X",    [0xA2]="IMMEDIATE",     [0xA3]="INDIRECT_X",
    [0xA4]="ZEROPAGE",     [0xA5]="ZEROPAGE",      [0xA6]="ZEROPAGE",      [0xA7]="ZEROPAGE",
    [0xA8]="IMPLICIT",     [0xA9]="IMMEDIATE",     [0xAA]="IMPLICIT",       [0xAB]="IMMEDIATE",
    [0xAC]="ABSOLUTE",     [0xAD]="ABSOLUTE",      [0xAE]="ABSOLUTE",      [0xAF]="ABSOLUTE",

    [0xB0]="RELATIVE",     [0xB1]="INDIRECT_Y",    [0xB2]="INDIRECT_Y",    [0xB3]="INDIRECT_Y",
    [0xB4]="ZEROPAGE_X",   [0xB5]="ZEROPAGE_X",    [0xB6]="ZEROPAGE_Y",    [0xB7]="ZEROPAGE_Y",
    [0xB8]="IMPLICIT",     [0xB9]="ABSOLUTE_Y",    [0xBA]="IMPLICIT",       [0xBB]="ABSOLUTE_Y",
    [0xBC]="ABSOLUTE_X",   [0xBD]="ABSOLUTE_X",    [0xBE]="ABSOLUTE_Y",    [0xBF]="ABSOLUTE_Y",

    [0xC0]="IMMEDIATE",    [0xC1]="INDIRECT_X",    [0xC2]="IMMEDIATE",     [0xC3]="INDIRECT_X",
    [0xC4]="ZEROPAGE",     [0xC5]="ZEROPAGE",      [0xC6]="ZEROPAGE",      [0xC7]="ZEROPAGE",
    [0xC8]="IMPLICIT",     [0xC9]="IMMEDIATE",     [0xCA]="IMPLICIT",       [0xCB]="IMMEDIATE",
    [0xCC]="ABSOLUTE",     [0xCD]="ABSOLUTE",      [0xCE]="ABSOLUTE",      [0xCF]="ABSOLUTE",

    [0xD0]="RELATIVE",     [0xD1]="INDIRECT_Y",    [0xD2]="INDIRECT_Y",    [0xD3]="INDIRECT_Y",
    [0xD4]="ZEROPAGE_X",   [0xD5]="ZEROPAGE_X",    [0xD6]="ZEROPAGE_X",    [0xD7]="ZEROPAGE_X",
    [0xD8]="IMPLICIT",     [0xD9]="ABSOLUTE_Y",    [0xDA]="IMPLICIT",       [0xDB]="ABSOLUTE_Y",
    [0xDC]="ABSOLUTE_X",   [0xDD]="ABSOLUTE_X",    [0xDE]="ABSOLUTE_X",    [0xDF]="ABSOLUTE_X",

    [0xE0]="IMMEDIATE",    [0xE1]="INDIRECT_X",    [0xE2]="IMMEDIATE",     [0xE3]="INDIRECT_X",
    [0xE4]="ZEROPAGE",     [0xE5]="ZEROPAGE",      [0xE6]="ZEROPAGE",      [0xE7]="ZEROPAGE",
    [0xE8]="IMPLICIT",     [0xE9]="IMMEDIATE",     [0xEA]="IMPLICIT",       [0xEB]="IMMEDIATE",
    [0xEC]="ABSOLUTE",     [0xED]="ABSOLUTE",      [0xEE]="ABSOLUTE",      [0xEF]="ABSOLUTE",

    [0xF0]="RELATIVE",     [0xF1]="INDIRECT_Y",    [0xF2]="INDIRECT_Y",    [0xF3]="INDIRECT_Y",
    [0xF4]="ZEROPAGE_X",   [0xF5]="ZEROPAGE_X",    [0xF6]="ZEROPAGE_X",    [0xF7]="ZEROPAGE_X",
    [0xF8]="IMPLICIT",     [0xF9]="ABSOLUTE_Y",    [0xFA]="IMPLICIT",       [0xFB]="ABSOLUTE_Y",
    [0xFC]="ABSOLUTE_X",   [0xFD]="ABSOLUTE_X",    [0xFE]="ABSOLUTE_X",    [0xFF]="ABSOLUTE_X"
}

local addrModeHandlers = {
    ["IMPLICIT"] = function(operands)
        return nil
    end,

    ["IMMEDIATE"] = function(operands)
        return operands[1]
    end,

    ["ZEROPAGE"] = function(operands)
        return operands[1]
    end,

    ["ZEROPAGE_X"] = function(operands)
        local state = emu.getState()
        return operands[1] + state["cpu.x"]
    end,

    ["ZEROPAGE_Y"] = function(operands)
        local state = emu.getState()
        return operands[1] + state["cpu.y"]
    end,

    ["ABSOLUTE"] = function(operands)
        return bytesToAddr(operands[1], operands[2])
    end,

    ["ABSOLUTE_X"] = function(operands)
        local state = emu.getState()
        return bytesToAddr(operands[1], operands[2]) + state["cpu.x"]
    end,

    ["ABSOLUTE_Y"] = function(operands)
        local state = emu.getState()
        return bytesToAddr(operands[1], operands[2]) + state["cpu.y"]
    end,

    ["ACCUMULATOR"] = function(operands)
        local state = emu.getState()
        return state["cpu.a"]
    end,

    ["RELATIVE"] = function(operands)
        local state = emu.getState()

        local isNegative = (operands[1] & 0x80) == 0x80
        local offset = isNegative and (operands[1] - 254) or (operands[1] + 2)

        return state["cpu.pc"] + offset
    end,

    ["INDIRECT"] = function(operands)
        local addr = bytesToAddr(operands[1], operands[2])

        local lo = emu.read(addr, emu.memType.nesMemory, false)
        local hi = emu.read(addr + 1, emu.memType.nesMemory, false)

        return bytesToAddr(lo, hi)
    end,

    ["INDIRECT_X"] = function(operands)
        local state = emu.getState()

        local zpAddr = (operands[1] + state["cpu.x"]) & 0xFF

        local lo = emu.read(zpAddr, emu.memType.nesMemory, false)
        local hi = emu.read((zpAddr + 1) & 0xFF, emu.memType.nesMemory, false)

        return bytesToAddr(lo, hi)
    end,

    ["INDIRECT_Y"] = function(operands)
        local state = emu.getState()

        local zpAddr = operands[1]

        local lo = emu.read(zpAddr, emu.memType.nesMemory, false)
        local hi = emu.read((zpAddr + 1) & 0xFF, emu.memType.nesMemory, false)

        return bytesToAddr(lo, hi) + state["cpu.y"]
    end
}


frameCount = 0
dump = ""

dumpFrames = 2

function bytesToAddr(lobyte, hibyte)

	local lo = lobyte & 0xFF;
	local hi = hibyte & 0xFF;
	return (hi << 8) | lo;

end

local function getFlags(status)
    return {
        N = ((status & 0x80) ~= 0) and 1 or 0,
        V = ((status & 0x40) ~= 0) and 1 or 0,
        B = ((status & 0x10) ~= 0) and 1 or 0,
        D = ((status & 0x08) ~= 0) and 1 or 0,
        I = ((status & 0x04) ~= 0) and 1 or 0,
        Z = ((status & 0x02) ~= 0) and 1 or 0,
        C = ((status & 0x01) ~= 0) and 1 or 0
    }
end

function writeDump()

	local out = io.open("D:\\Github\\The-Worst-NES-Emulator\\mesen-dump.txt", "w")
	
	if out then
		out:write(dump)
		out:close()
		emu.log("Great success!")
	else
		emu.log("Error: Could not open file for writing")
	end

end

function onFrame()

	if frameCount > dumpFrames then
		writeDump()
		emu.removeEventCallback(frameCallback, emu.eventType.endFrame)
		emu.removeMemoryCallback(instrCallback, emu.callbackType.exec, 0, 0xFFFF)
	end
		
	frameCount = frameCount + 1
end

-- please let me go to sleep
-- I'm so sorry
function onInstruction(address, value)
	local state = emu.getState()
	
	dump = dump .. "PC: " .. state["cpu.pc"] .. "  "
	
	local operands = {}
	local addrModeName = opcodeAddrModes[value]
	local addrMode = addrModeInfo[addrModeName]
	
	for i = 1, addrMode.size-1 do
		local operand = emu.read(address + i, emu.memType.nesMemory, false)
		table.insert(operands, operand)
	end
	
	dump = dump .. "OP: " .. value .. " "
	
	if addrMode.memory then
		local handler = addrModeHandlers[addrModeName]
		local address = handler(operands)
		dump = dump .. "$" .. address .. " = " .. emu.read(address, emu.memType.nesMemory, false)
	end
	
	local flags = getFlags(state["cpu.ps"])
	
	dump = dump .. "  A: " .. state["cpu.a"] .. " X: " .. state["cpu.x"] .. "  Y: " .. state["cpu.y"] .. " SP: " .. state["cpu.sp"] .. "  N: " .. tostring(flags.N) .. "  Z: " .. tostring(flags.Z) .. "  C: " .. tostring(flags.C) .. "\n"
	
end

frameCallback = emu.addEventCallback(onFrame, emu.eventType.endFrame)
instrCallback = emu.addMemoryCallback(onInstruction, emu.callbackType.exec, 0, 0xFFFF)
emu.log("Start")