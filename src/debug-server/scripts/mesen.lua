local socket = require("socket.core")

local client = socket.tcp()

local result,err = client:connect("localhost",3001)

client:settimeout(0)

function startFrame()
	emu.step(-10, emu.stepType.cpuCycleStep)
end

function onStep()
	emu.step(1, emu.stepType.step)
	
end

local i = 0

while i < 15000 do
	i=i+1
end

emu.log(i)


