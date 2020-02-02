package api;

//import com.yahoo.platform.yui.compressor.YUICompressor;

public class JSCompressor {
    private static final char LINE_FEED = '\n';
    private static final char CARRIAGE_RETURN = '\r';
    private static final char SPACE = ' ';
    private static final char TAB = '\t';

    /**
     * Compresses a String containing JavaScript by removing comments and
     * whitespace.
     *
     * @param script the String to compress
     * @return a compressed version
     */
    public static String compress(String script) {
        JSCompressor jsc = new JSCompressor(script);
        return jsc.outputBuffer.toString();
    }

    /**
     * Original JavaScript text.
     */
    private String script;
    /**
     * Compressed output buffer.
     * This buffer may only be modified by invoking the <code>append()</code>
     * method.
     */
    private StringBuffer outputBuffer;
    /**
     * Current parser cursor position in original text.
     */
    private int pos;
    /**
     * Character at parser cursor position.
     */
    private char ch;
    /**
     * Last character appended to buffer.
     */
    private char lastAppend;
    /**
     * Flag indicating if end-of-buffer has been reached.
     */
    private Boolean endReached = false;
    /**
     * Flag indicating whether content has been appended after last identifier.
     */
    private Boolean contentAppendedAfterLastIdentifier = true;

    /**
     * Creates a new <code>JavaScriptCompressor</code> instance.
     *
     * @param script
     */
    private JSCompressor(String script) {
        this.script = script;
        outputBuffer = new StringBuffer(script.length());
        nextChar();
        while (!endReached) {
            if (Character.isJavaIdentifierStart(ch)) {
                renderIdentifier();
            } else if (ch == ' ') {
                skipWhiteSpace();
            } else if (isWhitespace()) {
                // Compress whitespace
                skipWhiteSpace();
            } else if ((ch == '\"') || (ch == '\'')) {
                // Handle strings
                renderString();
            } else if (ch == '/') {
                // Handle comments
                nextChar();
                if (ch == '/') {
                    nextChar();
                    skipLineComment();
                } else if (ch == '*') {
                    nextChar();
                    skipBlockComment();
                } else {
                    append('/');
                }
            } else {
                append(ch);
                nextChar();
            }
        }
    }

    /**
     * Append character to output.
     *
     * @param ch the character to append
     */
    private void append(char ch) {
        lastAppend = ch;
        outputBuffer.append(ch);
        contentAppendedAfterLastIdentifier = true;
    }

    /**
     * Determines if current character is whitespace.
     *
     * @return true if the character is whitespace
     */
    private boolean isWhitespace() {
        return ch == CARRIAGE_RETURN || ch == SPACE || ch == TAB || ch == LINE_FEED;
    }

    /**
     * Load next character.
     */
    private void nextChar() {
        if (!endReached) {
            if (pos < script.length()) {
                ch = script.charAt(pos++);
            } else {
                endReached = true;
                ch = 0;
            }
        }
    }

    /**
     * Adds an identifier to output.
     */
    private void renderIdentifier() {
        if (!contentAppendedAfterLastIdentifier)
            append(SPACE);
        append(ch);
        nextChar();
        while (Character.isJavaIdentifierPart(ch)) {
            append(ch);
            nextChar();
        }
        contentAppendedAfterLastIdentifier = false;
    }

    /**
     * Adds quoted String starting at current character to output.
     */
    private void renderString() {
        char startCh = ch; // Save quote char
        append(ch);
        nextChar();
        while (true) {
            if ((ch == LINE_FEED) || (ch == CARRIAGE_RETURN) || (endReached)) {
                // JavaScript error: string not terminated
                return;
            } else {
                if (ch == '\\') {
                    append(ch);
                    nextChar();
                    if ((ch == LINE_FEED) || (ch == CARRIAGE_RETURN) || (endReached)) {
                        // JavaScript error: string not terminated
                        return;
                    }
                    append(ch);
                    nextChar();
                } else {
                    append(ch);
                    if (ch == startCh) {
                        nextChar();
                        return;
                    }
                    nextChar();
                }
            }
        }
    }

    /**
     * Moves cursor past a line comment.
     */
    private void skipLineComment() {
        while ((ch != CARRIAGE_RETURN) && (ch != LINE_FEED)) {
            if (endReached) {
                return;
            }
            nextChar();
        }
    }

    /**
     * Moves cursor past a block comment.
     */
    private void skipBlockComment() {
        while (true) {
            if (endReached) {
                return;
            }
            if (ch == '*') {
                nextChar();
                if (ch == '/') {
                    nextChar();
                    return;
                }
            } else
                nextChar();
        }
    }

    /**
     * Renders a new line character, provided previously rendered character
     * is not a newline.
     */
    private void renderNewLine() {
        if (lastAppend != '\n' && lastAppend != '\r') {
            append('\n');
        }
    }

    /**
     * Moves cursor past white space (including newlines).
     */
    private void skipWhiteSpace() {
        if (ch == LINE_FEED || ch == CARRIAGE_RETURN) {
            renderNewLine();
        } else {
            append(ch);
        }
        nextChar();
        while (ch == LINE_FEED || ch == CARRIAGE_RETURN || ch == SPACE || ch == TAB) {
            if (ch == LINE_FEED || ch == CARRIAGE_RETURN) {
                renderNewLine();
            }
            nextChar();
        }
    }
    public static void main(String[] s){
//        YUICompressor.main();
//        String a= JavaScriptCompressor.compress("a=1\r\n\r\n\r\n/*123123*/a();/*123*/b=2\r\nvar a=    1; \n \t a = 333;b=666\n  /*123123*/ \napp({  \t  });//123345\ntest()");
//        System.out.println(a);
        String a= JSCompressor.compress("{\"a\":1,\"b\":2,\"c\":{\"d\":2}}");
        System.out.println(a);

    }
}