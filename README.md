# My Incomplete NES Emulator (Mine)
**TECHNICALLY** runs NES roms.

**48/56** distinct instructions and **143/151** opcodes implemented.  
Emulator largely unoptimized, causing execution to be significantly slower than real hardware.  

Running a custom test rom compared to Mesen.
<img width="800" height="384" alt="emudemo2" src="https://github.com/user-attachments/assets/c7303d31-8307-46c6-ad41-9e74404cc03d" />

Logic, sprites, backgrounds, and color palettes are emulated accurately here.    

**SORT OF** running Donkey Kong, a real first-party Nintendo rom.  
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
