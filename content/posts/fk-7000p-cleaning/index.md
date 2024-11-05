---
author: Nathan Vaughn
date: "2024-11-06"
description: Deep dive into a Focus FK-7000P keyboard I bought on eBay.
tags:
  - mechanical keyboards
title: FK-7000P Cleaning
---

## Background

While randomly browsing eBay for "old keyboard", I stumbled across
a listing for a FK-7000P keyboard.

![eBay Listing Image](img/s-l1600.png "eBay Listing Image")

When I searched it at the time, Deskthority had
[very little information on it](https://web.archive.org/web/20240201173649/https://deskthority.net/wiki/Focus_FK-7000P).
With the keyboard being confirmed as mechanical, and extremely weird, I had to have it.
I love retro computer things and especially uncommon things.

## Box

A cool thing about this listing is that it came with the original box.

![Top of the box](img/PXL_20241027_202739202.jpg "Top of the box")

![Bottom of the box](img/PXL_20241027_202727984.jpg "Bottom of the box")

![Left front edge of the box](img/PXL_20241027_202628413.jpg "Left front edge of the box")

![Right front edge of the box](img/PXL_20241027_202630896.jpg "Right front edge of the box")

A couple interesting things to note about the box:

1. The box says "Windows, OS/2 Ready". OS/2 was publicly announced and released in 1987.
   The first version of Windows was released in 1985. We'll come back to this.
2. The box also uses the phrase "Super Spacesaver". Generally, the "Spacesacer" term is
   used for keyboards without a numpad, such as the
   "[IBM Space Saving Keyboard](https://deskthority.net/wiki/IBM_Space_Saving_Keyboard)".
   This keyboard clearly has a numpad, and I'm not really sure what space they're
   claiming to save.
3. This keyboard was manufactured by
   [Focus Electronic](https://deskthority.net/wiki/Focus_Electronic).
   However, there is no branding on the box or keyboard exterior with the "Focus" name,
   only their "Key Track" branding. The closest thing to a brand name anywhere
   is the "FK" prefix on the model number.

## Keyboard

The keyboard itself is a full-size 103-key keyboard with a trackball where the
arrow keys would usually go. Instead, around the trackball are mouse button-like
arrow keys. Additionally, a left and right mouse button are located below the
right control key.

A couple layout oddities:

- The right <kbd>Shift</kbd> key is unusually narrow, and to the right of it is the
  <kbd>\</kbd> key.
- While this keyboard has "Windows" keys, the left key is blank and the right key has
  an asterisks on it (more on this later).
- The lock lights are embedded in the relevant keys, instead of the normal location
  on the keyboard (again, more on this later!).

![Front of keyboard as I got it](img/PXL_20241027_202907929.jpg "Front of keyboard as I got it")

For connectivity, the keyboard has a male 5-pin DIN connector, and a female DB-9
(RS232) serial connector for the integrated mouse.

![Connectors](img/PXL_20241027_203344284.jpg "Connectors")

The keyboard helpfully came with the original user's guide as well.

![User's Guide Front](img/PXL_20241027_202951582.jpg "User's Guide Front")

![User's Guide Centerfold](img/PXL_20241027_203045194.jpg "User's Guide Centerfold")

![User's Guide Back](/img/PXL_20241027_203123449.jpg "User's Guide Back")

Using the keyboard with a modern computer ended up being less painful than I expected.
Don't get me wrong, it was still painful, but less than I expected. Process:

1. Set the keyboard to "A" with the switch on the back.
2. Set the mouse to "2" with the other switch on the back.
3. Adapt the 5-pin DIN keyboard connector to PS/2. [Non-affiliate link](https://www.amazon.com/dp/B07KVDZWBX/)
4. Adapt the PS/2 keyboard connector to USB with an active adapter. [Non-affiliate link](https://www.amazon.com/dp/B00IACID2C)
5. Adapt the DB-9 mouse connector to USB. [Non-affiliate link](https://www.amazon.com/dp/B00AHYJWWG)
   I only ever tried adapters with the FTDI chipset and had no issues.
6. In Windows, use Device Manager to force update the drivers for the serial adapter.
   For me on Windows 11, it then triggered Windows Update to install the drivers.

Easy, right?

![Mess of adapters required to get it to work](img/PXL_20241031_225301921.jpg "Mess of adapters required to get it to work")

Now, let's talk about the most interesting part, the keys and keycaps.
The key switches are knockoff Alps switches of some kind. They're white, clicky,
and totally unbranded other than some 4 digit code that is different on almost all of
the switches.

![Close up of one of the key switches](img/PXL_20241027_203302022.jpg "Knockoff Alps?")

The three switches for the lock keys are notable exceptions. These three keys
have a red LED embedded in the switch, are yellow, and are linear switches with no
click.

![Keyboard with most of the keycaps removed](img/PXL_20241027_205320353.jpg "Keyboard with most of the keycaps removed")

The keycaps are all double shot and appear to be ABS.

![Bottom of a keycap](img/PXL_20241027_203517033.jpg "One keycap removed")

The Print Screen key and Pause key are the only two keycaps that also have side legends.
These are printed on and are not part of the plastic.

Across all of the keycaps, there are four different colors. Most keycaps have black
text, but the <kbd>Ctrl</kbd>
