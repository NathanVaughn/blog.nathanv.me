---
author: Nathan Vaughn
date: "2026-01-19"
description: A major footgun when creating multi-architecture Docker images and pushing them to a registry
tags:
  - CI/CD
  - GitHub Actions
  - Docker
title: Docker Multi-architecture Image Builds
---

## Background

When building and pushing multi-architecture Docker images, you need to be
very careful about pushing these images to the registry.

When you push a Docker
image to a registry, what happens is that each layer in the image
is uploaded as a [blob](https://en.wikipedia.org/wiki/Object_storage).
After every layer is uploaded, the manifest is then updated.
The manifest is basically just a JSON file that tells consumer what tags
correspond to what blobs.

Pseudocode example:

```json
{
  "tags": {
    "latest": [
      {
        "platform": "amd64",
        "blobs": ["sha256:abcdef"]
      }
    ],
    "2.1.0": [
      {
        "platform": "amd64",
        "blobs": ["sha256:abcdef"]
      }
    ]
  }
}
```

So once the layers are finished uploading, the manifest is updated to either
add a new tag, or change the existing tag.
The thing to be careful of here is that whenever a push is made for an existing tag,
the _entire_ contents are overwritten.

## Problem

What this means that if you create a multi-architecture build on a single server,
everything will be just fine.

```json
{
    "tags": {
        "latest": [
            {
                "platform": "amd64",
                "blobs": [
                    "sha256:abcdef"
                ]
            }
            {
                "platform": "arm64/v7",
                "blobs": [
                    "sha256:123456"
                ]
            }
        ]
    }
}
```

However, if you split the build across different
servers (maybe to take advantage of building an ARM image on an ARM server),
whatever build finishes last will be the one overwrites the registry manifest last
and will effectively be the only copy available in the registry.

```json
{
  "tags": {
    "latest": [
      {
        "platform": "arm64/v7",
        "blobs": ["sha256:123456"]
      }
    ]
  }
}
```

## Solution

### Building

First, when building the image with
[`docker buildx build`](https://docs.docker.com/reference/cli/docker/buildx/build),
set the following options in the
[`output`](https://docs.docker.com/reference/cli/docker/buildx/build#output) section:

- `type=image`: Export to an image
- `push=true`: Still push the image to the registry
- `push-by-digest=true`: However, only push the layers, don't update the manifest
- `name-canonical=true`: Add an additional name `name@digest`. See below.

Additionally, _only tag the image with its base name_. By this, I mean use
`--tag docker.io/library/python` not `--tag docker.io/library/python:3.14.1`.

### Manifest Update

Now that the image is pushed without the tags, the manifest needs to be updated.
Thankfully, this can be done with the
[`docker buildx imagetools create`](https://docs.docker.com/reference/cli/docker/buildx/imagetools/create/)
command. The documentation for this command isn't super obvious, but it takes an image
name and a list of tags to assign to it. The `--append` flag allows it to _add_ these
layers to a tag, instead of replacing it. For example:

```bash
docker buildx imagetools create --append -t docker.io/library/python:3.14.1 -t docker.io/library/python:3.14 -t docker.io/library/python:3 docker.io/library/python@sha256:abcdef
```

By adding the `name-canonical=true` earlier, you can reference the image you want by the SHA256 digest.
Do note that you can only run this command for a single registry. If your image is
pushed to more than one registry, then you will need to run this command multiple times.

### Conclusion

Hopefully this helps when publishing multi-architecture images with CI/CD. Below is
an abbreviated example I've made for one of my images using GitHub Actions.
I think this is simpler and has less magic than the
[official Docker example](https://docs.docker.com/build/ci/github-actions/multi-platform/#distribute-build-across-multiple-runners):

```yml
name: Build and Push Images

jobs:
  bake:
    runs-on: ubuntu-latest

    permissions:
      contents: read

    steps:
      - name: Checkout Code
        uses: actions/checkout@v6

      # Left as an excerise to the reader, but in my case this is a Python
      # script that generates a Bake file
      # https://docs.docker.com/build/bake/reference/
      - name: Create Bake File
        run: python dev/baker.py

      # Upload the generated Bake file so it can be used across jobs
      - name: Upload Bake File
        uses: actions/upload-artifact@v6
        with:
          path: docker-bake.json
          name: bake-file

      # Splits the Bake file into a build matrix based on the platforms
      - name: Generate Build Matrix
        id: generate
        uses: docker/bake-action/subaction/matrix@v6
        with:
          # Name of the target in the Bakefile
          target: webtrees
          fields: platforms

      # This is another exercise left to the reader, but this step
      # outputs a string with tags that are going to be built prefaced by "-t",
      # so it can be piped in to the command later to update the tags in the
      # registry after the image is built.
      - name: Output Metadata
        id: metadata
        run: python dev/metadata.py

    # Save outputs
    outputs:
      build-matrix: ${{ steps.generate.outputs.matrix }}
      metadata: ${{ steps.metadata.outputs.metadata }}

  build:
    needs: bake
    # Select an ARM runner for ARM platforms
    runs-on: ${{ startsWith(matrix.platforms, 'linux/arm') && 'ubuntu-24.04-arm' || 'ubuntu-latest' }}

    strategy:
      matrix:
        # Include the matrix from the previous step
        include: ${{ fromJson(needs.bake.outputs.build-matrix) }}

    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout Code
        uses: actions/checkout@v6

      # Download the Bake file so it can be used to build
      - name: Download Bake File
        uses: actions/download-artifact@v7
        with:
          name: bake-file

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        with:
          version: latest

      # Login to the registries we will be pushing to
      - name: DockerHub Login
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_PASSWORD }}

      - name: Github CR Login
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Actually build the image
      - name: Build
        uses: docker/bake-action@v6
        id: builder
        with:
          # This ensures we use a local file. Otherwise, it will default to the
          # current git repository at the current commit. If your Bake file
          # is not generated but static, maybe you want this.
          source: .
          targets: ${{ matrix.target }}
          # Here, we forcefully set the tags to the base image names.
          # This can also be done in the Bake file generation step.
          # Additionally, we force the build to a single architecture.
          set: |
            *.tags=index.docker.io/username/imagename
            *.tags=ghcr.io/username/imagename
            *.platform=${{ matrix.platforms }}

      # By saving the output metadata to a file, it makes it easier for debugging
      # and referencing in other later steps
      - name: Save Build Metadata
        run: echo '${{ steps.builder.outputs.metadata }}' > build-metadata.json

      # Upload artifact for debugging purposes
      - name: Upload Build Metadata
        uses: actions/upload-artifact@v6
        with:
          path: build-metadata.json
          # A unique name is required as this is a matrix step
          name: build-metadata-${{ hashFiles('build-metadata.json') }}

      # This is another excercise left to the reader. Somehow, this step
      # needs to known what tags to update in the registries. This can be
      # potentially be extracted from the Bake file or by some other means.
      # However, it cannot come from the `builder` step, because that output will
      # not have the tags since it was intentionally stripped to ensure
      # `push-by-digest` works.
      - name: Upload Digest
        run: |
          docker buildx imagetools create --append ${{ fromJSON(needs.bake.outputs.metadata).tag_cmd }} $(cat build-metadata.json | jq -r '.webtrees.[ "containerimage.digest" ]')
          docker buildx imagetools create --append ${{ fromJSON(needs.bake.outputs.metadata).tag_cmd }} $(cat build-metadata.json | jq -r '.webtrees.[ "containerimage.digest" ]')
```

Obviously, there are other ways you can approach this depending on how you tag images,
whether or not you commit a Bake file, etc., but I'm found this approach to work
well for me for what I'm doing. It also manages to skip the final "merge" step
all of the official examples show which adds complexity.

## References

- <https://docs.docker.com/build/ci/github-actions/multi-platform/#with-bake>
- <https://docs.docker.com/build/exporters/image-registry/>
