import Parser from "./parser/Parser.ts";
import { valueComputing } from "./function/value-computing.ts";

async function repl() {

    console.log('HoseinTahanLanguage v0.1');

    const parser = new Parser();

    const memoryVAR = parser.memoryVAR;
    const memoryFUNC = parser.memoryFUNC;
    const memoryLIST = parser.memoryLIST;

    const input = await Deno.readTextFile('./runner.htl');

    const program = parser.produceAST(input);

    program.body.forEach(programAST => {

        const result = valueComputing(programAST, memoryVAR, memoryFUNC, memoryLIST);

        if (JSON.stringify(result) !== '{}')
            console.log(result);

    });

}

repl();