---
title: CPU architecture
description: CPU architecture
keywords:
  - CPU architecture
---

## Apple Silicon

Apple silicon chips. Apple's custom chips are Arm-based and are similar to the A-series chips used in iPhones and iPads, and Apple unveiled the first Apple silicon Macs in November 2020.

The M1 chip brings up to 3.5x faster CPU performance, up to 6x faster GPU performance, and up to 15x faster machine learning capabilities compared to the Intel chips used in prior-generation machines.

Compared to the latest PC laptop chips, the M1 offers 2x faster CPU performance and does so using just 25 percent of the power.

### Rosetta 2

Because the M1 chip is using different architecture, Apple has built tools to allow developers to create Universal app binaries that run flawlessly on both ‌Apple Silicon‌ and Intel chips, plus it has developed the Rosetta 2 translation layer that allows x86 apps to run on the M1 chip.

Rosetta 2 is a reimagining of Rosetta, the feature that allowed PowerPC apps to run on Intel-based Macs back in 2006 when Apple swapped to Intel from PowerPC.

With Rosetta 2, apps designed for Intel machines will continue to run on M1 Macs with some limited performance compromises. For the most part, apps run similarly on both Intel and M1 Macs due to the performance improvements introduced in the M1.

Everything should function as normal when transitioning to M1 Macs, and over the course of a few years, most popular Mac apps will likely be built to run on the M1 Macs natively. Right now, there is one major compromise when choosing an M1 Mac, and that's Windows support.


## ARM vs X86

ARM is the newest CPU architecture used by all modern smartphones in both Android and Apple devices. However, the Arm processor is also making its way into the computer ecosystem with products like Windows on Arm and Apple’s upcoming custom CPUs for Macs. 

### 64-bit CPU Architecture

x86 traditionally targets **peak performance** over all else which is a key difference with Arm processors who aim for **better energy efficiency**. In today’s world, we have 64-bit architectures mainstream across smartphones and PCs. This change didn’t come so fast, it was around 2012 that phones also made the transition but this didn’t change the way we use the devices it just made them handle things better. Today both architectures support 64-bit but it’s more relevant in smartphones.

Today, 64-bit architectures are mainstream across smartphones and PCs, but this wasn’t always the case. Phones didn’t make the switch until 2012, around a decade after PCs. In a nutshell, 64-bit computing leverages registers and memory addresses large enough to use 64-bit (1s and 0s) long data types. As well as compatible hardware and instructions, you also need a 64-bit operating system too, such as Android.

:::info Today, both architectures support 64-bit, but it's more recent in mobile
 
PCs moved to 64-bit well before smartphones, but it wasn’t Intel that coined the modern x86-64 architecture (also known as x64). That accolade belongs to AMD’s announcement from 1999, which retrofitted Intel’s existing x86 architecture. Intel’s alternative IA64 Itanium architecture dropped by the wayside.

Arm introduced its ARMv8 64-bit architecture in 2011. Rather than extend its 32-bit instruction set, Arm offers a clean 64-bit implementation. To accomplish this, the ARMv8 architecture uses two execution states, AArch32 and AArch64. As the names imply, one is for running 32-bit code and one for 64-bit. The beauty of the ARM design is the processor can seamlessly swap from one mode to the other during its normal execution. This means that the decoder for the 64-bit instructions is a new design that doesn’t need to maintain compatibility with the 32-bit era, yet the processor as a whole remains backwardly compatible. However, Arm has indicated that future ARMv9 Cortex-A processors will be 64-bit only by 2023, cutting off support for old 32-bit applications and operating systems on these next-gen CPUs. In fact, 2021’s small Cortex-A510 and powerhouse Cortex-X2 CPUs are already 64-bit only.
:::

Industry veterans may remember the hoopla when Apple introduced its first 64-bit processor ahead of its Android rivals. The move to 64-bit didn’t transform day-to-day computing. However, it is important to run math efficiently using high-accuracy floating-point numbers. 64-bit registers also improve 3D rendering accuracy, encryption speed, and simplifies addressing more than 4GB RAM.


### ARM Architecture

**ARM is RISC (Reduced Instruction Set Computing) based while Intel (x86) is CISC (Complex Instruction Set Computing)**. Arm’s CPU instructions are reasonably atomic, with a very close correlation between the number of instructions and micro-ops. 

CISC, by comparison, offers many more instructions, many of which execute multiple operations (such as optimized math and data movement). This leads to better performance, but more power consumption decoding these complex instructions.

Arm introduced its ARMv8 64-bit architecture in 2011. Rather than extend its 32-bit instruction set, Arm offers a clean 64-bit implementation. To accomplish this, the ARMv8 architecture uses two execution states, AArch32 and AArch64. As the names imply, one is for running 32-bit code and one for 64-bit. The beauty of the ARM design is the processor can seamlessly swap from one mode to the other during its normal execution. This means that the decoder for the 64-bit instructions is a new design that doesn’t need to maintain compatibility with the 32-bit era, yet the processor as a whole remains backwardly compatible.

### ARM’s win on mobile ecosystem

The architectural differences discussed above partly explain the current successes and issues faced by the two chip behemoths. Arm’s low power approach is perfectly suited to the 3.5W Thermal Design Power (TDP) requirements of mobile, yet performance scales up to match Intel’s laptop chips too. Meanwhile, Intel’s 100W TDP typical Core i7 wins big in servers and high-performance desktops but historically struggles to scale down below 5W.

One unique feature of Arm’s architecture has been particularly instrumental in keeping TDP low for mobile applications, heterogeneous computing. The idea is simple enough, build an architecture that allows different CPU parts (in terms of performance and power) to work together for improved efficiency. Heterogeneous Multiprocessing (HMP) is already big in the Android space, see chips like the Snapdragon 810, Exynos 7420 or Helio X20, but Heterogeneous Compute (HC) is the next evolution.

:::info GPU, DSP, CPU
- Typical CPU may be good at serial processing,
- A GPU can handle streams of parallel data
- A DSP is better optimized for crunching numbers to high accuracy in real-time
  - DSPs process real-world data from a wider range of sensors or human interfaces, including image processing, and produce an output that’s generally in the form of an array of numbers.
:::

reference: 
- [Intel x86 vs. ARM: Architecture and all key differences explained](https://levelup.gitconnected.com/intel-x86-vs-arm-architecture-and-all-key-differences-explained-fb54a04788dc)
- [Arm vs x86: Instruction sets, architecture, and all key differences explained](https://www.androidauthority.com/arm-vs-x86-key-differences-explained-568718/)

## x86 vs x64 

### What is x86 Architecture?

x86 is a family of instruction set architectures (ISA) for computer processors initially developed by Intel. They refer to the way a computer processor (CPU) handles information.

:::info What is an instruction set architecture?

It is an abstract model of a computer that is also referred to as computer architecture. It is part of a computer that pertains to programming which specifies the behaviour of machine code. The instruction set is the language that a computer’s brain is designed to understand which provides commands to the computer processor and tells it what to do.

:::

The x86 is developed based on the Intel 8086 microprocessor and its 8088 variant where it started out as a 16-bit instruction set for 16-bit processors where many additions and extensions have been added to the x86 where it grew to 32-bit instruction sets over the years with almost entirely full backward compatibility.

The bit in both 32-bit and 16-bit is shorthand for a number. For example, for 32-bit, the number will contain 32 bits which are binary digits that are either 0 or 1. For a 32-bit number, it will look like something like this 10101010101010101010101010101010.

Today, the term x86 is used generally to refer to any 32-bit processor compatible with the x86 instruction set. x86 microprocessor is capable of running almost any type of computer from laptops, servers, desktops, notebooks to supercomputers.

### What is x64?

Similar to the x86, the x64 is also a family of instruction set architectures (ISA) for computer processors. However, x64 refers to a 64-bit CPU and operating system instead of the 32-bit system which the x86 stands for.

**But why does x64 refers to a 64-bit system while x86 refers to a 32-bit system?**

That was the question I asked myself too at first. However, this is because as when the processor was first being created, it was called 8086. The 8086 was well designed and popular which can understand 16-bit machine language at first. It was later improved and expanded the size of 8086 instructions to a 32-bit machine language. As they improve the architecture, they kept 86 at the end of the model number, the 8086. This line of processors was then known as the x86 architecture.

On the other hand, x64 is the architecture name for the extension to the x86 instruction set that enables 64-bit code. When it was initially developed, it was named as x86-64. However, people thought that the name was too length where it was later shortened to the current x64.

### What is the difference between x86 and x64?

As you guys can already tell, the obvious difference will be the amount of bit of each operating system. x86 refers to a 32-bit CPU and operating system while x64 refers to a 64-bit CPU and operating system.

**Does having more amount of bits in each operating system have any benefits?**

Of course! This is one of the main reasons the number of bits keeps increasing over the years from 16-bits to 64-bits currently. As mentioned above, the bits are shorthand for a number that can only be 1 or 0. This causes the 32-bit CPUs not to be able to use a lot of RAM as 1 and 0, the total number of combinations is only 2^32 which equals to 4,294,967,295. This means the 32-bit processor has 4.29 billion memory locations each storing one byte of data which equates to approx. 4GB of memory which the 32-bit processor can access without workarounds in software to address more.

Today, 4GB is enough for basic tasks but if you wish to run multiple programs and other more heavy load tasks, 4GB is not sufficient. In addition, with a 64-bit system, it will be more efficient as it can process data in 64-bit chunks compared to 32-bit chunks. Your 64-bit system can also run 32-bit programs as they are backwards compatible. But, it doesn’t work the other way where a 32-bit computer cannot run 64-bit programs.


## Setting up Apple M1 for development

### Rosetta vs Native Terminal

Command line tools are crucial  for our day-to-day workflows. However, several critical CLI tools like `nvm` and `brew` do not have native versions built for the new M1 architecture, so installing them on your native terminal can be frustrating. 

Thankfully, with Apple's translation layer [Rosetta 2](https://developer.apple.com/documentation/apple_silicon/about_the_rosetta_translation_environment), we can easily download and compile applications that were built for x86_64 and run them on Apple Silicon. I’ll explain how to duplicate the macOS native terminal and force the duplicated terminal to always run with Rosetta 2. Using this "Rosetta" terminal makes it a breeze to install our preferred tools.

You may check more useful tips in this blog post [Tips and Tricks to Set Up Your Apple M1 for Development](https://www.courier.com/blog/tips-and-tricks-to-setup-your-apple-m1-for-development/)

### Which terminal that I'm using?

To confirm that you are using a Rosetta Terminal by entering the `arch` command, which should return `i386`.
```
$ arch
i386
```

Confirm that you are using the Native Terminal by typing the `arch` command, which should return `arm64`. While you are here, you can also validate the installation.
```
$ arch
arm64
```

I recommend using the "Rosetta-Terminal" for installing the rest of your command line tools and using the Native Terminal for your daily workflow.