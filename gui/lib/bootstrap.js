/*****
 * Copyright (c) 2017-2022 Christoph Wittmann, chris.wittmann@icloud.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*****/


/*****
 * This is the startup or bootstrap function for the client framework code.
 * This is called when the body has been loaded with the onload="bootstrop()"
 * HTML attribute.  This ensures a standard environment initialization accross
 * web applications and a standard initiialization sequence.
*****/
register(function bootstrap() {
    window.win = mkWindow(window);
    window.doc = win.doc();
    window.styleSheet = doc.getStyleSheet('webapp');
    Widget.initializeWidgetClass();

    styleSheet.createRule(`html {
        color: var(--color1);
        background-color: var(--background1);
        font-family: Avenir, Helvetica, Arial, sans-serif;
    }`);

    styleSheet.createRule(`* {
        height: 100%;
        width: 100%;
        margin: 0px;
        padding:  0px;
    }`);

    doc.body().append(mkSignInWidget());
});