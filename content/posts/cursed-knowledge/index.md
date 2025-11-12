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

## Python Pre-allocated Integers

[Source](https://github.com/satwikkansal/wtfpython?tab=readme-ov-file#-how-not-to-use-is-operator)

The CPython interpreter pre-allocates integer objects in the range -5 to 256.
This can result in surprising behavior when (mis)using the `is` operator:

```python
>>> a = 256
>>> b = 256
>>> a is b
True

>>> a = 257
>>> b = 257
>>> a is b
False
```

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

## Command Professional Edition Missing DLL (Early 2022)

Source: Hours of my life wasted

[Command Professional Edition](https://command.matrixgames.com/?page_id=3822)
is missing a DLL file in the installer that prevents the command line version
from running. Downloading the missing DLL from NuGet and placing it in the
correct directory will fix the issue.

## Command Professional Edition Progress Bar (Early 2022)

Source: Even more hours of my life wasted

The command line version of
[Command Professional Edition](https://command.matrixgames.com/?page_id=3822)
will crash immediately if it is run in a context where there is no terminal width
(for example, from a Python `subprocess` call). This is because it tries to draw
a progress bar and wants to know terminal width to draw it. A terminal window
must be spawned for every execution.

## Authentik/Qt Port Number (March 2024)

[Source](https://blog.nathanv.me/posts/authentik-octoprint-cura/)

The [Qt](https://www.qt.io/) network library may include the port number in the hostname
(for example, `https://blog.nathanv.me:443`).
[Authentik](https://goauthentik.io/) will treat this as a completely different host.

## Hiding Tkinter Combobox Popdown (August 2025)

This is less "cursed knowledge" and more "horrible hack", but to my knowledge there
is no way to prevent a [Tkinter](https://docs.python.org/3/library/tkinter.html)
combobox from showing it's popdown widget when clicked.
In the event you want to draw your own custom widget, you can immediately destroy the
popdown widget after it is shown:

```python
import tkinter as tk
from tkinter import ttk

combobox = ttk.Combobox(root, values=["Option 1", "Option 2"])

def on_click(event: tk.Event) -> None:
    popdown = combobox.tk.call("ttk::combobox::PopdownWindow", str(combobox))
    combobox.tk.call("destroy", f"{popdown}.f")

combobox.bind("<Button-1>", on_click)
```

## Authentik Verified Email (November 2025)

[Source](https://docs.goauthentik.io/releases/2025.10/#default-oauth-scope-mappings)

Authentik version 2025.10 now defaults `email_verified` to False for OIDC providers.
Some applications require `email_verified` to be set to True to allow login.
In particular, the
[Kubernetes API server](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)
is one of these applications.
This means any upstream applications like [Headlamp](https://headlamp.dev/) that
use the Kubernetes API server will also stop working with little indication.

To fix this, in Authentik, go to Customization -> Property Mappings.
Create a new "Scope Mapping". Set the scope name to "email" and the Expression as:

```python
return {
    "email": user.email,
    "email_verified": True,
}
```

In your OIDC providers, add the new scope to the provider scopes under
"Advanced protocol settings".

## xlrd Error Codes (November 2025)

[Source](https://stackoverflow.com/a/34907530)

With the Python [xlrd](https://xlrd.readthedocs.io/en/latest/) library
used to read old `.xls` files, cells that contain an error
will silently return the internal error code rather than a string
such as `"#N/A"`, like [openpyxl](https://openpyxl.readthedocs.io/en/stable/) does.

This is a pretty major footgun if your code is expecting the cell to contain a number
as an actual value versus an error code are indistinguishable.

A way to handle this is as follows:

```python
from xrld.biffh import XL_CELL_ERROR, error_text_from_code

...

cell = sheet.cell(rowx=row, colx=col)
value = cell.value

# check if the cell contains an error
if cell.ctype == XL_CELL_ERROR:
  # if so, convert the error code into the equivalent error text
  # https://github.com/python-excel/xlrd/blob/3a19d22014d7b3f3041b7188d21a653c18c709bf/xlrd/biffh.py#L90-L100
  value = error_text_from_code[value]
```
