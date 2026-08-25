local addrModeInfo = {
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

local opcodeAddrModes = {
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




frameCount = 0
dump = ""

dumpFrames = 2

function writeDump()

	local out = io.open("D:\\Github\\The-Worst-NES-Emulator\\mesen-dump.txt", "w")
	
	if out then
		out:write(dump)
		out:close()
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
	dump = dump .. "PC: " .. emu.getState()["cpu.pc"] .. "  "
	
	local operands = ""
	local addrModeName = opcodeAddrModes[value]
	local addrMode = addrModeInfo[addrMode]
	local memReadResult = -1
	
	for i = 1, addrMode.size-1 do
		operands = operands .. tostring(emu.read(address + i, emu.memType.nesMemory, false))
	end
	
	dump = dump .. "INSTR: " .. value .. operands .. "  "
	-- todo: reimplement addr mode handlers to lua
	if memReadResult ~= -1 then
		dump = dump .. "(
	
end

frameCallback = emu.addEventCallback(onFrame, emu.eventType.endFrame)
instrCallback = emu.addMemoryCallback(onInstruction, emu.callbackType.exec, 0, 0xFFFF)