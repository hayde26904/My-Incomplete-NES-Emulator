# My Incomplete NES Emulator (MINE)
It barely works, but it's _**MINE**_.

Nintendo Entertainment System emulator, written in Typescript. Written as an experiment to learn more about low level hardware. I prioritized getting an actual game to run over accuracy.

**48/56** distinct instructions and **143/151** opcodes implemented.  

Execution is significantly slower than real hardware due to limited optimization.

Running a custom test ROM compared to Mesen.
<img width="800" height="384" alt="emudemo2" src="https://github.com/user-attachments/assets/410d2d20-56c8-409d-b1c6-63363b5d859e" />


Logic, sprites, backgrounds, and color palettes are emulated accurately here.    

**SORT OF** running Donkey Kong, a real first-party Nintendo ROM.  
<img width="640" height="360" alt="emudemo" src="https://github.com/user-attachments/assets/89042d2d-18a9-43c1-a8ec-2cf049c0926d" />

The graphics are garbled but gameplay logic runs accurately.  


This project has been created using **webpack-cli**, you can now run

```
npm run build
```

or

```
yarn build
```

to bundle your application
