---
author: Nathan Vaughn
cover: img/it-works.png
date: "2023-12-18"
description: Getting the Garmin 400 series GPS simulator running on modern versions of Windows
images:
  - /posts/garmin-400-sim-modern-windows/img/it-works.png
tags:
  - aviation
  - Garmin
title: Garmin 400 Series Simulator on Windows 11
userelativecover: true
---

## Background

I've been working on getting my pilot's license and the plane I am renting has a Garmin
GNS 430 GPS in it. I wanted to practice using it outside the (expensive) airplane.
Garmin publishes a free simulator to use for Windows here:
[https://www8.garmin.com/support/download_details.jsp?id=3527](https://www8.garmin.com/support/download_details.jsp?id=3527)

However, this fails to execute on a modern version of Windows.

![Unsupported 16-bit application. The program or feature GNC400WT.EXE cannot start or run due to incompatibility with 64-bit versions of Windows](img/launch-failure.png)

It even says on the webpage that it won't work.

![Windows XP Operating System required. This simulator is not compatible with Windows Vista or Windows 7 Operating Systems. This simulator is not compatible with 64-bit Operating Systems.](img/notes.png "Not with that attitude.")

## Solution

The fix is simple. Download and install [winevdm](https://github.com/otya128/winevdm).

Run the .exe again and it should work.

![Garmin GPS trainer running on Windows 11](img/it-works.png)

Well, most of it.

![Program panic](img/panic.png)

Clicking on anything in the HSI, nav mode selector, or altitude/speed selector
causes an interrupt. Still, it's enough for me to learn the menu layouts
and options before getting in the airplane and clicking "Continue" does
seem to let the program keep functioning.
