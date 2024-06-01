import Parser from "./parser.ts";


repl();


async function repl(){


    const parser=new Parser();
    console.log('repl v0.1');

    while (true) {

        const input =  prompt("");
        // check for no user input or exit keyword
        if(!input || input.includes("exit")) {
            console.log('byby');
        }

        const program=parser.produceAST(input!);
       
        console.log(program);

    }

}