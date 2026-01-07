---
author: Nathan Vaughn
date: "2026-01-06"
description: "X-Clacks-Overhead"
tags:
  - Cloudflare
title: Clacks Overhead
---

While I've tangentially heard of the
[`X-Clacks-Overhead`](https://xclacksoverhead.org/home/about)
header, I was recently reminded of it on
[Hacker News](https://news.ycombinator.com/item?id=46475437).
In short, it's a HTTP header included in web server responses to keep alive the
memory of someone who has passed, in reference to Terry Pratchett's Discworld series.

> A man is not dead while his name is still spoken.

This is very easy to add with [Cloudflare Pages](https://pages.cloudflare.com/)
by just including a `_headers` text file:

```text
/*
    X-Clacks-Overhead: GNU <name here>
```

I've added this header to this blog,
though not with Terry Pratchett's name. One of my high school
friends was killed in a motor vehicle accident while serving in the US military
in Germany. We were in band together for many years as well as Spanish class.
She was incredibly kind, smart, and a talented flute player.
I remember reading of her passing on LinkedIn and it hit me like me a wall of bricks,
a bright light having been snuffed out too soon.

Rest in peace Lt. Hodsden.
