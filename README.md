# Redis-Lite

Redis-Lite is a lightweight, simplified version of Redis built using Node.js. This project provides basic Redis functionality such as setting and getting keys with expiration support, simulating commands like `SET`, `GET`, and others.

## Features

- `SET <key> <value> [EX <seconds>] [PX <milliseconds>]`: Set a key with an optional expiration time in seconds (EX) or milliseconds (PX).
- `GET <key>`: Retrieve the value of a given key.
- Simple key-value store with support for TTL (Time-To-Live) functionality.
- Written in Node.js using the `net` module to simulate the Redis protocol.

## Prerequisites

- Node.js (version 14 or higher)
- NPM (Node Package Manager)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/redis-lite.git
   cd redis-lite
Install the required dependencies:

bash
Copy code
npm install
Run the server:

bash
Copy code
node server.js
The server will start and listen on port 6379 (default Redis port).

Usage
Once the server is running, you can use the redis-cli or any Redis-compatible client to interact with it.

Example commands:
Set a key with a value and expiration (in seconds):

bash
Copy code
SET mykey myvalue EX 10
Get a key:

bash
Copy code
GET mykey
If the key has expired or doesn't exist, it will return null:

bash
Copy code
GET non_existing_key
If a key is set with an expiration and is accessed after the expiration time, it will be deleted automatically.

Custom Serialization
Redis-Lite implements a custom serialization format to send and receive data. This ensures compatibility with the Redis protocol:

String: $<length>\r\n<value>\r\n
Integer: :<value>\r\n
Error: -<message>\r\n
Array: *<length>\r\n<value>\r\n...
Troubleshooting
Issue: "ERR unknown command" or incorrect results.

Ensure you're using the correct commands and format.
Check the server log for details.
Issue: Connection errors or server not starting.

Ensure Node.js is properly installed and you have the required permissions to bind to port 6379.
Future Improvements
Support for additional Redis commands such as DEL, EXPIRE, etc.
Persistent storage for data (instead of in-memory store).
More robust error handling and validation for commands.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
This project was created to learn about how Redis works and how network protocols function in Node.js.

csharp
Copy code

### Notes:
1. Replace `https://github.com/yourusername/redis-lite.git` with your actual GitHub repository link.
2. You can modify features in the "Features" section depending on what functionality you have implemented in your Redis-Lite.
3. Add any additional information if needed and update the "Future Improvements" section as you make progress.

Now, this README file should render correctly and give a proper structure to your project
