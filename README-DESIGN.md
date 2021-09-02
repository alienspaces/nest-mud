# Nest M.U.D - Design

- [Getting Started](README.md)
- [How to Play](README-HOWTOPLAY.md)
- [API](README-API.md)
- [Design](README-DESIGN.md)

## API Design

The API is designed to emulate the experience of hand typed commands with responses that describe the result of that command.

Each time a command is submitted the response will include all other events that occurred in the same location as the character since their previous command. This way a character is given a running commentary of other events that have occurred in that location.

All character commands, monster commands and other automatic location events can occur at most, every two seconds.

A game client could choose to automatically submit a single `look` command for a character every two seconds when the player is detected as idle to retrieve any other events that have occurred.
