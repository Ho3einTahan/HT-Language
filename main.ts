import Parser from "./parser.ts";
import { valueComputing } from "./function/value-computing.ts";

async function repl() {
    console.log('HoseinTahanLanguage v0.1');

    const parser = new Parser();
    const memory = parser.memory;

    const input = await Deno.readTextFile('./runner.htl');

    const program = parser.produceAST(input);
    program.body.forEach(programAST => {
        const result = valueComputing(programAST, memory);
        if (JSON.stringify(result) !== '{}') {
            console.log(result);
        }
    });

}

repl();
