---
author: Nathan Vaughn
date: "2024-07-05"
description: No long be bound by the shackles of AWS or your filesystem.
tags:
  - Docker
  - S3
  - Cloudflare
title: Making Sonatype Nexus 3 work with Cloudflare R2
---

This is how to make [Sonatype Nexus 3](https://www.sonatype.com/products/sonatype-nexus-repository)
work with
[Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)
(and possibly other S3-compatible blob storage providers).

## Configuration

Add the following line to your `nexus.properties` file:

```properties
nexus.blobstore.s3.ownership.check.disabled=true
```

This should be located in the `<sonatype data>/etc/` directory. If using
the `docker.io/sonatype/nexus3` Docker image, this will be `/nexus-data/etc/` by
default.

This configuration option prevents Sonatype Nexus from performing bucket ownership
checks that most S3-compatible storage providers don't implement.

## Blob Store

In the web UI, select the following options when setting up a new blob store:

- Region: `us-east-1`. `Default` will not work.
- Bucket: Your bucket name
- Access Key ID: Your Cloudflare R2 access key ID. See <https://developers.cloudflare.com/r2/api/s3/tokens/>
- Secret Access Key: Your Cloudflare R2 secret access key. See <https://developers.cloudflare.com/r2/api/s3/tokens/>
- Endpoint URL: `https://<account id>.r2.cloudflarestorage.com/`
- Use path-style access: False

All other options are not specific to R2.

## References

- <https://developers.cloudflare.com/r2/api/s3/api/>
- <https://github.com/sonatype/nexus-public/issues/200#issuecomment-2210739187>
