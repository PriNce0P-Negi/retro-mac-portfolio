Retro OS Portfolio

This is my personal portfolio website, built to look and function like a retro operating system. I wanted to build something interactive instead of a standard scrolling website. 

Everything here is built from scratch using plain HTML, CSS, and vanilla JavaScript. There are no frameworks or heavy libraries involved. 

Features

A working window manager where you can drag, minimize, maximize, and close windows.
A terminal application that actually works. You can type commands to navigate the site, check my skills, or run some hidden easter eggs.
A spotlight search feature. Press Ctrl+K to bring up a search bar that filters through the different windows and sections of the site.
A recruiter view. For people who just want to read my resume quickly without clicking through windows, there is a toggle in the menu bar that instantly switches the entire site into a clean, single-page printable format.
Built-in games like Snake and Minesweeper for fun.
An audio system built with the Web Audio API to handle boot chimes and click sounds without relying on external mp3 files.

How to run it locally

Since this is just static HTML, CSS, and JavaScript, you do not need any complex build steps to run it. 

1. Clone this repository to your local machine.
2. Open the folder in your terminal and start a local web server. For example, if you have Python installed, you can run: python -m http.server 8000
3. Open your browser and navigate to http://localhost:8000

Note on running it locally: If you just double-click the index.html file instead of using a local server, the YouTube video embeds in the project cards might fail to load due to browser security restrictions on the file protocol. Running a simple local server fixes this.

Why I built this

I learn best by doing. Building an OS interface from scratch in the browser was a good way to test my understanding of DOM manipulation, event listeners, state management, and CSS positioning. It was a lot of trial and error, but it was a fun challenge.
