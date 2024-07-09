import Parser from "./parser.ts";
import { valueComputing } from "./function/value-computing.ts";

repl();



async function repl() {

    console.log('repl v0.1');

    const parser = new Parser();
   
    const memory = parser.memory;

    while (true) {

        const input = prompt("");
        // check for no user input o    r exit keyword
        if (!input || input.includes("exit")) {
            // break
            console.log('byby');
        }

        const program = parser.produceAST(input!);

        program.body.forEach(programAST => {
            const result = valueComputing(programAST,memory);
                console.log(result);
            
        });

        
    }
}