---
author: Nathan Vaughn
date: "2025-01-07"
description: Getting the `uv` package manager to work nicely with Azure Artifacts and Pipelines
tags:
  - Python
  - Azure Artifacts
  - Azure Pipelines
title: Azure Artifacts with uv
---

## Introduction

I love the new [`uv`](https://github.com/astral-sh/uv) Python package/project
manager and am beginning to adopt it at work. However, getting it working well
with Azure Artifacts and Pipelines took a bit of fiddling so I wanted to write
up my findings to supplement the
[official documentation](https://docs.astral.sh/uv/guides/integration/alternative-indexes/#azure-artifacts).

## Setup

Before creating the virtual environment, ensure you have the
[`keyring`](https://github.com/jaraco/keyring) tool installed with the
[`artifacts-keyring`](https://github.com/microsoft/artifacts-keyring) package.
This will require a .NET 8+ runtime.

```bash
uv tool install keyring --with artifacts-keyring
```

Now, in the `pyproject.toml` file, setup the following:

```toml
[tool.uv]
# tells uv to use subprocess mode for this keyring provider
keyring-provider = "subprocess"

[[tool.uv.index]]
# name is arbitrary
name = "azure-devops"
# replace items in curly braces with your actual org/project/feed names
# the username must be provided in the URL
url = "https://VssSessionToken@pkgs.dev.azure.com/{organization}/{project}/_packaging/{feed}/pypi/simple/"
# if you want to publish a package as well, set the following URL too
publish-url = "https://pkgs.dev.azure.com/{organization}/{project}/_packaging/{feed}/pypi/upload/"
# setup Azure Artifacts as the default package index
default = true
```

Now, `uv sync` or other commands which create the virtual environment should work.

To use this in an Azure Pipeline takes a little more configuration. You now
need to provide `uv` with a valid access token since it can't obtain
one interactively. Additionally, the keyring provider needs to be disabled
so that the provided username and password is used instead. In the Pipeline YAML file,
this can be done like so:

```yaml
env:
  # https://docs.astral.sh/uv/configuration/environment/#uv_index_name_password
  # https://docs.astral.sh/uv/configuration/indexes/#providing-credentials
  # This environment variable must match the name you gave the index,
  # except capitalized and the non-alphanumeric characters replaced with underscores
  UV_INDEX_AZURE_DEVOPS_USERNAME: VssSessionToken
  UV_INDEX_AZURE_DEVOPS_PASSWORD: $(System.AccessToken)
  UV_KEYRING_PROVIDER: disabled
```

Here is a full example of installing `uv`, persisting the cache, and
installing packages. This example is cross-platform and should work
on both Windows and Linux runners.

```yaml
variables:
  # These will be set as global environment variables
  UV_INDEX_AZURE_DEVOPS_USERNAME: VssSessionToken
  UV_KEYRING_PROVIDER: disabled
  # This environment variable keeps the cache in a predictable location
  UV_CACHE_DIR: $(Agent.TempDirectory)/cache/uv

steps:
  - script: pipx install uv
    displayName: Install uv

  - task: Cache@2
    displayName: Cache uv data
    inputs:
      key: '"uv-cache" | "$(Agent.OS)" | .python-version | uv.lock'
      restoreKeys: |
        "uv-cache" | "$(Agent.OS)" | .python-version
        "uv-cache" | "$(Agent.OS)"
        "uv-cache"
      path: $(UV_CACHE_DIR)

  - script: uv sync
    displayName: Install dependencies
    env:
      # This needs to be explicitly mapped as it contains a secret.
      UV_INDEX_AZURE_DEVOPS_PASSWORD: $(System.AccessToken)
```

If you want to publish a package using `uv`, replace the `uv sync` step with these
instead:

```yaml
- script: uv build
  displayName: Build package
  env:
    # This is still required, as uv will fetch packages required by the build system
    UV_INDEX_AZURE_DEVOPS_PASSWORD: $(System.AccessToken)

# Ensure the Pipeline has permission to publish packages
# https://learn.microsoft.com/en-us/azure/devops/artifacts/feeds/feed-permissions?view=azure-devops#pipelines-permissions
- script: uv publish --index azure-devops
  displayName: Publish package
  env:
    # The environment variable used for publish packages is different
    UV_PUBLISH_TOKEN: $(System.AccessToken)
```

## References

- <https://docs.astral.sh/uv/guides/integration/alternative-indexes/#azure-artifacts>
- <https://dev.to/kummerer94/azure-pipelines-uv-cache-46ii>
- <https://github.com/astral-sh/uv/issues/7860>
