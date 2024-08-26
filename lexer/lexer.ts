// https://github.com/Ho3einTahan/HT-Language
// -----------------------------------------------------------
// ---------------          LEXER          -------------------
// ---  Responsible for producing tokens from the source   ---
// -----------------------------------------------------------

// Represents tokens that our language understands in parsing.

export enum TokenType {
    Number,
    Identifier,
    //
    Let,
    Const,
    Int,
    String,
    List,
    Func,
    //
    Bool,
    True,
    False,
    //
    Log,
    //
    Enum,
    //
    BinaryOperator,
    LogicalOperator,
    //
    OpenParen,
    CloseParen,
    //
    OpenBracket,
    CloseBracket,
    //
    openBrack,
    closeBrack,
    //
    IF,
    ELSE,
    ElseIf,
    //
    Symbol,
    //
    Decrement,   // --a
    Increment,   // ++a
    Exponentiation, // **a
    //
    EOF, // END OF FILE
}

/**
 * Constant lookup for keywords and known identifiers + symbols.
 */
const KEYWORDS: Record<string, TokenType> = {
    //
    enum: TokenType.Enum,
    //
    list: TokenType.List,
    let: TokenType.Let,
    const: TokenType.Const,
    int: TokenType.Int,
    string: TokenType.String,
    bool: TokenType.Bool,
    func: TokenType.Func,
    //
    true: TokenType.True,
    false: TokenType.False,
    //
    log: TokenType.Log,
    //
    if: TokenType.IF,
    else: TokenType.ELSE,
    elseif: TokenType.ElseIf,
};

// Reoresents a single token from the source-code.
export interface Token {
    value: string; // contains the raw value as seen inside the source code.
    type: TokenType; // tagged structure.
}

// Returns a token of a given type and value
function token(value = "", type: TokenType): Token {
    return { value, type };
}

/**
 * Returns whether the character passed in alphabetic -> [a-zA-Z]
 */
function isalpha(src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

/**
 * Returns true if the character is whitespace like -> [\s, \t, \n]
 */
function isskippable(str: string) {
    return str == " " || str == "\n" || str == "\t" || str == "\r";
}

/**
 Return whether the character is a valid integer -> [0-9]
 */
export function isint(str: string) {
    if (str && str.length > 0) {
        const c = str.charCodeAt(0);
        return c >= 48 && c <= 57;
    }
    return false;
}


/**
 * Given a string representing source code: Produce tokens and handles
 * possible unidentified characters.
 *
 * - Returns a array of tokens.
 * - Does not modify the incoming string.
 */
export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    let src = sourceCode.split("");

    // produce tokens until the EOF is reached.
    while (src.length > 0) {
        // BEGIN PARSING ONE CHARACTER TOKENS
        if (src[0] == "(") {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        } else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        }
        else if (src[0] == '[') {
            tokens.push(token(src.shift(), TokenType.openBrack));
        }
        else if (src[0] == ']') {
            tokens.push(token(src.shift(), TokenType.closeBrack));
        }
        else if (src[0] == '{') {
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        }
        else if (src[0] == '}') {
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        }
        // HANDLE PRE INCREMENT AND DECREMENT AND Exponentiation
        else if (src[0] == '+' && src[1] == '+') {
            src.shift();
            src.shift();
            tokens.push(token('++', TokenType.Increment));
        }
        else if (src[0] == '-' && src[1] == '-') {
            src.shift();
            src.shift();
            tokens.push(token('--', TokenType.Decrement));
        }
        else if (src[0] == '*' && src[1] == '*') {
            src.shift();
            src.shift();
            tokens.push(token('**', TokenType.Exponentiation));
        }
        // HANDLE BINARY OPERATORS
        else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%" || src[0] == "^") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        }
        else if (src[0] == "=" || src[0] == ">" || src[0] == "<" || src[0] == "!" || src[0] == "&" || src[0] == "|") {
            tokens.push(token(src.shift(), TokenType.LogicalOperator));
        }
        // HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
        else {
            // Handle numeric literals -> Integers
            if (isint(src[0])) {
                let num = "";
                while (src.length > 0 && isint(src[0])) {
                    num += src.shift();
                }

                // append new numeric token.
                tokens.push(token(num, TokenType.Number));
            } // Handle Identifier & Keyword Tokens.
            else if (isalpha(src[0]) || src[0] == "'") {
                let ident = "";
                while (src.length > 0 && isalpha(src[0]) || isint(src[0]) || src[0] == "'") {
                    ident += src.shift();
                }

                // CHECK FOR RESERVED KEYWORDS
                const reserved = KEYWORDS[ident];
                // If value is not undefined then the identifier is
                // reconized keyword
                if (reserved) {
                    tokens.push(token(ident, reserved));
                } else {
                    // Unreconized name must mean user defined symbol.
                    tokens.push(token(ident, TokenType.Identifier));
                }

            }
            else if (src[0] == ',' || src[0] == ':' || src[0] == '.') {
                tokens.push(token(src.shift(), TokenType.Symbol));
            }
            else if (isskippable(src[0])) {
                // Skip uneeded chars.
                src.shift();
            } // Handle unreconized characters.
            else {
                console.error("Unreconized character found in source: ", src[0].charCodeAt(0), src[0]);
            }
        }
    }

    tokens.push(token("EndOfFile", TokenType.EOF));

    return tokens;
}