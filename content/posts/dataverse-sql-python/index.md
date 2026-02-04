---
author: Nathan Vaughn
date: "2026-02-03"
description: Run SQL queries against Microsoft Dataverse with Python
tags:
  - Microsoft
  - Microsoft Dataverse
  - SQL
  - Python
title: Microsoft Dataverse SQL queries with Python
---

## Background

Despite the very confusing branding, I like
[Microsoft Dataverse](https://www.microsoft.com/en-us/power-platform/dataverse) a lot.
It's basically a SQL server with a web UI and HTTP APIs built-in. And it is an actual
SQL server too, you can query a
[read-only interface](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/dataverse-sql-query)
easily with
[SQL Server Management Studio](https://learn.microsoft.com/en-us/ssms/).
However, querying the SQL interface with Python eluded me,
and I only recently figured it out. There are
[expensive commercial offerings available](https://www.cdata.com/drivers/dataverse/python/),
but really, you can do it easily with only a few lines of code.
I somehow stumbled across
[this GitHub gist](https://gist.github.com/rickythefox/8bdda7e814aacc22be956cb53d377761)
which was the "Eureka!" moment for me.

## Solution

You will need to install the [mssql-python](https://pypi.org/project/mssql-python)
package to connect to the SQL server
and the [azure-identity](https://pypi.org/project/azure-identity) or the
[msal](https://pypi.org/project/msal) package to obtain an access token.

Obtaining a Microsoft authentication token is its own complicated subject,
and varies a lot depending on whether the application is being run directly by a user
versus on a web application backend, whether you can utilize an authentication broker,
and other factors. The below code sample shows one of the simplest possible ways.

```python
# /// script
# dependencies = ["mssql-python", "azure-identity"]
# ///

import struct

import mssql_python
from azure.identity import InteractiveBrowserCredential, TokenCachePersistenceOptions

# Dataverse/Dynamics Hostname
DATAVERSE_HOST = "{org}.crm.dynamics.com"
# Magic constant
SQL_COPT_SS_ACCESS_TOKEN = 1256
# SQL port number
SQL_PORT = 1433

# Acquire access token. There are many ways, this is just a simple interactive method.
cache_options = TokenCachePersistenceOptions()
credential = InteractiveBrowserCredential(cache_persistence_options=cache_options)
# This scope is important. This differs from the scope required for the HTTP APIs
token = credential.get_token(f"https://{DATAVERSE_HOST}/.default")

# Encode token for MS SQL server
token_bytes = token.token.encode("utf-16-le")
token_struct = struct.pack(f"<I{len(token_bytes)}s", len(token_bytes), token_bytes)

# Connect with access token
connection = mssql_python.connect(
    f"Server={DATAVERSE_HOST},{SQL_PORT};Encrypt=yes;",
    attrs_before={SQL_COPT_SS_ACCESS_TOKEN: token_struct},
)
cursor = connection.cursor()

# Execute a query
query = "SELECT TOP 10 * FROM account"
cursor.execute(query)
rows = cursor.fetchall()

# Show results
for row in rows:
    print(row)

```

## Conclusion

This has unlocked a whole new world of possibilities for me. Instead of manually
running queries with SQL Server Management Studio, I can now programmatically run them
and do things with the outputs, infinitely faster and more powerful than the HTTP APIs.
I really wish Microsoft would document this better and not leave developers making
educated guesses off the Azure SQL instructions.

## References

- <https://gist.github.com/rickythefox/8bdda7e814aacc22be956cb53d377761>
- <https://learn.microsoft.com/en-us/azure/azure-sql/database/azure-sql-python-quickstart?view=azuresql&tabs=windows%2Csql-inter#add-code-to-connect-to-azure-sql-database>
- <https://learn.microsoft.com/en-us/sql/connect/odbc/using-azure-active-directory?view=sql-server-ver17#authenticating-with-an-access-token>
