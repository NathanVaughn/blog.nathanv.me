---
author: Nathan Vaughn
date: "2025-10-23"
description: A collection of cursed knowledge I've gathered over the years.
tags:
  - programming
title: Cursed Knowledge
---

This list is inspired by the [Immich team](https://immich.app/cursed-knowledge)
and will be updated over time. Items were accurate when written,
but may become outdated.

## Sun Grid Engine Qmon Missing Fonts (February 2019)

[Source](http://talby.rcs.manchester.ac.uk/~rcs/_bits/sge_qmon_fonts.html)

Sometimes, out of the box, Sun Grid Engine's Qmon utility is
lacking some fonts to actually launch. Install them with:

```bash
yum install xorg-x11-fonts-75dpi
yum install xorg-x11-fonts-100dpi
```

Then, you need to configure Qmon to use these fixed fonts.
Copy the config file into the user's home directory:

```bash
cp $SGE_ROOT/qmon/Qmon $HOME
```

Now, edit the file replacing these lines:

```text
  _FontLists_.*.interface: \
  -adobe-helvetica-medium-r-*--14-*-*-*-p-*-*-*=R,\
  -adobe-helvetica-bold-r-*--14-*-*-*-p-*-*-*=B,\
  -adobe-helvetica-medium-r-*--20-*-*-*-p-*-*-*=BIG,\
  -adobe-helvetica-medium-r-*--12-*-*-*-p-*-*-*=SMALL,\
  -adobe-helvetica-medium-r-*--24-*-*-*-p-*-*-*=HUGE,\
  -adobe-courier-medium-r-*--14-*-*-*-m-*-*-*=LIST,\
  -adobe-courier-bold-r-*--14-*-*-*-m-*-*-*=LISTBOLD,\
  -adobe-courier-medium-r-*--12-*-*-*-m-*-*-*=LISTSMALL,\
  -adobe-helvetica-medium-r-*--10-*-*-*-p-*-*-*=QUEUEICON

  _FontLists_.*.dialog_font:  -adobe-courier-medium-r-*--14-*-*-*-m-*-*-*
  _FontLists_.*.matrix_font:  -adobe-helvetica-medium-r-*--14-*-*-*-p-*-*-*
  _FontLists_.*.browser_font: -adobe-courier-medium-r-*--12-*-*-*-m-*-*-*
  _FontLists_.*.fixed_font:  -adobe-courier-medium-r-*--14-*-*-*-m-*-*-*
```

with

```text
  _FontLists_.*.interface: \
  fixed=R,\
  fixed=B,\
  fixed=BIG,\
  fixed=SMALL,\
  fixed=HUGE,\
  fixed=LIST,\
  fixed=LISTBOLD,\
  fixed=LISTSMALL,\
  fixed=QUEUEICON

  _FontLists_.*.dialog_font:  fixed
  _FontLists_.*.matrix_font:  fixed
  _FontLists_.*.browser_font: fixed
  _FontLists_.*.fixed_font:  fixed
```

## Ephemeral Network Ports (2021)

[Source](https://en.wikipedia.org/wiki/Ephemeral_port)

When connecting to a remote server, a dynamic port number may be used.
This can make things challenging when your IT department wants to know
what ports to open in the firewall. The range of port numbers
potentially used will vary by operating system.

## Command PE Missing DLL (Early 2022)

Source: Hours of my life wasted

[CommandPE](https://command.matrixgames.com/?page_id=3822)
is missing a DLL file in the installer that prevents the command line version
from running. Downloading the missing DLL from NuGet and placing it in the
correct directory will fix the issue.

## Command PE Progress Bar (Early 2022)

Source: Countless hours of my life wasted

The command line version of
[CommandPE](https://command.matrixgames.com/?page_id=3822)
will crash immediately if it is run in a context where there is no terminal width
(for example, from a Python `subprocess` call). This is because it tries to draw
a progress bar and wants to know terminal width to draw it. A terminal window
must be spawned for every execution.

## Authentik/Qt Port Number (March 2024)

[Source](https://blog.nathanv.me/posts/authentik-octoprint-cura/)

The [Qt](https://www.qt.io/) network library may include the port number in the hostname
(for example, `https://blog.nathanv.me:443`).
[Authentik](https://goauthentik.io/) will treat this as a completely different host.
