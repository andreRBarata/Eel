# Eel Terminal

<!-- toc orderedList:0 -->

* [Eel Terminal](#eel-terminal)
    * [Summary](#summary)
    * [Background and References](#background-and-references)
    * [Installation](#installation)

<!-- tocstop -->


## Summary

The goal of this project is to use the Electron App Engine and nodejs to:
* Extend Javascript syntax to allow the use of shell commands.
* Create a user-friendly graphical frontend for execution of Javascript commands and scripts with:
	* Auto Complete
	* Syntax Highlighting
* Extend existing shell commands.

This will be a desktop application with the objective of mimic the functionality with a modern UI and scripting support using Javascript. The idea is to make the terminal less intimidating for beginners, make the command results more easily readable and provide a similar experience independent of platform. This will be achieved by independently coding some of the standard unix commands.

This project also aims to extend Javascript syntax to add a simpler way of executing functions with flags as parameters and support bash syntax elements like pipes and redirects.

## Background and References

The idea for this project came from the now defunct project TermKit. It had as objective to create a graphical, user friendly interface for the traditional unix command-line as well as expanding the capabilities of some of the commands. This project came to a holt when it’s creator hit a blocker with WebKit, the engine he was using.

I believe that using the new Electron App Engine it is possible to accomplish what this project intended. However I also intend to try to go beyond the original objective of the project and add the ability to do scripting in this shell using an superset of Javascript. This is possible through the usage of SweetJs which allows the creation of macros for Javascript transpiling.

## Installation

To run from this repo clone it and execute the commands:

```
	npm install

	npm start
```

On the project directory.

A compiled build is also available for Linux Debian 64x.

Check the wiki for usage info.
