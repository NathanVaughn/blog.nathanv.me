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

# setup Azure Artifacts as the default package index
[[tool.uv.index]]
# name is arbitrary
name = "azure-devops"
# replace items in curly braces with your actual org/project/feed names
# the username must be provided in the URL
url = "https://VssSessionToken@pkgs.dev.azure.com/{organization}/{project}/_packaging/{feed}/pypi/simple/"
default = true
```

Now, `uv sync` or other commands which create the virtual environment should work.

To use this in an Azure Pipeline takes a little more configuration. You now
need to provide `uv` with a valid access token since it can't obtain
one interactively. Additionally, the keyring provider needs to be disabled
so that the provided password is used instead. In the Pipeline YAML file,
this can be done like so:

```yaml
env:
  # https://docs.astral.sh/uv/configuration/environment/#uv_index_name_password
  # https://docs.astral.sh/uv/configuration/indexes/#providing-credentials
  # This environment variable must match the name you gave the index,
  # except capitalized and the non-alphanumeric characters replaced with underscores
  UV_INDEX_AZURE_DEVOPS_PASSWORD: $(System.AccessToken)
  UV_KEYRING_PROVIDER: disabled
```

Here is a full example of installing `uv`, persisting the cache, and
installing packages. This example is cross-platform and should work
on both Windows and Linux runners.

```yaml
steps:
  - script: pipx install uv
    displayName: Install uv

  # https://dev.to/kummerer94/azure-pipelines-uv-cache-46ii
  - task: PythonScript@0
    displayName: Get uv cache dir
    inputs:
      scriptSource: inline
      script: |
        import subprocess
        print(f'##vso[task.setvariable variable=uv-cache-path]{subprocess.getoutput(["uv", "cache", "dir"])}')

  - task: Cache@2
    displayName: Cache uv data
    inputs:
      key: '"uv-cache" | "$(Agent.OS)" | uv.lock'
      restoreKeys: |
        "uv-cache" | "$(Agent.OS)"
        "uv-cache"
      path: $(uv-cache-path)

  - script: uv sync
    displayName: Install dependencies
    env:
      UV_INDEX_AZURE_DEVOPS_PASSWORD: $(System.AccessToken)
      UV_KEYRING_PROVIDER: disabled
```
