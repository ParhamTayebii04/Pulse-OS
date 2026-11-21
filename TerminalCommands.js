/* =========================================================
   PULSE OS
   TERMINAL
========================================================= */

const terminalForm =
    document.getElementById(
        "terminalForm"
    );

const terminalInput =
    document.getElementById(
        "terminalInput"
    );

const terminalOutput =
    document.getElementById(
        "terminalOutput"
    );


/* =========================================================
   COMMANDS
========================================================= */

const commands = {

    help: () => `
Available commands:

  help       Show available commands
  about      About Parham
  skills     Display technical skills
  projects   Show portfolio projects
  contact    Show contact information
  clear      Clear terminal
  date       Show current system time
`,

    about: () => `
Parham
Full Stack Developer

Building modern interfaces with
HTML, CSS and JavaScript.

Status: ONLINE
`,

    skills: () => `
Core Skills:

  HTML5
  CSS3
  JavaScript ES6+
  Responsive Design
  UI/UX Architecture
  Git
  Three.js
`,

    projects: () => `
Projects:

  [01] Vira Elevator Mazandaran
       HTML / CSS / JavaScript / Three.js

  [02] More projects loading...
`,

    contact: () => `
Contact:

  GitHub    → github.com/ParhamTayebii04
  LinkedIn  → Available soon
  Telegram  → Available soon
  Email     → hello@example.com
`,

    date: () => {
        return new Date().toLocaleString();
    }
};


/* =========================================================
   PRINT LINE
========================================================= */

function printTerminal(
    text,
    className = ""
) {

    const line =
        document.createElement("div");

    line.className =
        `terminal-line ${className}`;

    line.textContent = text;

    terminalOutput.appendChild(
        line
    );


    terminalOutput.scrollTop =
        terminalOutput.scrollHeight;
}


/* =========================================================
   CLEAR
========================================================= */

function clearTerminal() {

    terminalOutput.innerHTML = "";
}


/* =========================================================
   EXECUTE COMMAND
========================================================= */

function executeCommand(
    rawCommand
) {

    const command =
        rawCommand
            .trim()
            .toLowerCase();


    if (!command) {
        return;
    }


    printTerminal(
        `parham@pulse:~$ ${command}`,
        "terminal-gold"
    );


    if (command === "clear") {

        clearTerminal();

        return;
    }


    if (
        Object.prototype.hasOwnProperty.call(
            commands,
            command
        )
    ) {

        const result =
            commands[command]();

        printTerminal(result);

        return;
    }


    printTerminal(
        `Command not found: ${command}. Type "help".`,
        "terminal-error"
    );
}


/* =========================================================
   FORM
========================================================= */

terminalForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        executeCommand(
            terminalInput.value
        );

        terminalInput.value = "";
    }
);